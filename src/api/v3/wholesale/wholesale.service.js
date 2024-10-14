const AuthService = require('../../common/auth.service')
const UserRole = require('../../../user-roles')
const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AD_UPDATE_TOPIC_ARN,
  TIRES_BUCKET_NAME,
  TIRE_UPDATE_TOPIC_ARN,
} = require('../../../config')
const Db = require('../../../db/postgres-db')
const AWS = require('aws-sdk')
const S3BucketService = require('../../common/s3-bucket.service')

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: 'eu-north-1',
})

// Db Wholesaler Table Columns
const columns = ['wholesaler_id', 'wholesale_number', 'name', 'active']

const WholesaleService = {
  all,
  create,
  findOne,
  workshops,
  apps,
  update,
  customerAuth,
  addApp,
  removeApp,
  deleteAdItems,
  triggerADItemsUpdate,
  adItems,
  getTireFileUploadUrl,
  updateTires,
}

module.exports = WholesaleService

/**
 * @returns {Promise<*>}
 */
async function all() {
  try {
    const result = await Db.query(`SELECT * FROM wholesaler ORDER BY name ASC`)

    return result.rows.length > 0
      ? result.rows.map((row) => {
          return row
        })
      : []
  } catch (e) {
    throw e
  }
}

/**
 * @param data
 * @returns {Promise<{name, active, wholesale_id}>}
 */
async function create(data) {
  try {
    const keys = Object.keys(data)
    const params = keys.map((k, index) => `$${index + 1}`)
    const values = Object.values(data)

    const query = `INSERT INTO wholesaler(${keys.join(', ')}) VALUES (${params.join(
      ', '
    )}) RETURNING *`
    return await Db.query(query, values)
  } catch (e) {
    throw e
  }
}

/**
 * @param id
 * @returns {Promise<{name, active, id, wholesale_number}>}
 */
async function findOne(id) {
  try {
    const query = `SELECT * FROM wholesaler WHERE wholesaler_id=$1 LIMIT 1`
    const result = await Db.query(query, [id])
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (e) {
    throw e
  }
}

/**
 * @param wholesalerId
 * @returns {Promise<*>}
 */
async function workshops(wholesalerId) {
  try {
    const query = `SELECT * FROM workshops WHERE wholesaler_id=$1`
    const result = await Db.query(query, [wholesalerId])
    return result.rows
  } catch (e) {
    throw e
  }
}

/**
 * @param wholesalerId
 * @returns {Promise<*>}
 */
async function apps(wholesalerId) {
  try {
    const query = `
      SELECT app.* 
      FROM wholesale_app AS wa 
      INNER JOIN app ON app.app_id = wa.app_id 
      WHERE wa.wholesaler_id = $1
    `

    const result = await Db.query(query, [wholesalerId])
    return result.rows
  } catch (e) {
    throw e
  }
}

/**
 * @param id
 * @param data
 * @returns {Promise<{name, active, wholesaler_id, wholesale_number}>}
 */
async function update(id, data) {
  try {
    // Use only column keys
    const keys = Object.keys(data).filter((key) => columns.indexOf(key) !== -1)
    const params = keys.map((key, index) => `${key}=$${index + 1}`)

    // Use only column values
    let values = []
    keys.map((key) => (values = [...values, data[key]]))

    const query = `UPDATE wholesaler SET ${params.join(', ')} WHERE wholesaler_id=$${
      params.length + 1
    } RETURNING *`

    const result = await Db.query(query, [...values, id])
    return result.rows[0]
  } catch (e) {
    throw e
  }
}

/**
 * @param workshopNumber
 * @param customerNumber
 * @param appId
 * @returns {Promise<string>}
 */
async function customerAuth(workshopNumber, customerNumber, appId) {
  try {
    const query = `
      SELECT w.* FROM workshop_app AS wa 
      LEFT JOIN workshops AS w ON wa.workshop_id=w.workshop_id
      WHERE wa.app_id=$3 AND w.workshop_number=$1 AND w.customer_number=$2
      LIMIT 1
    `
    const result = await Db.query(query, [workshopNumber, customerNumber, appId])

    if (result.rows.length > 0) {
      const workshop = result.rows[0]

      const appQuery = `
        SELECT * FROM wholesale_app 
        WHERE wholesaler_id=$1 AND app_id=$2
      `

      const appResult = await Db.query(appQuery, [workshop.wholesaler_id, appId])

      if (appResult.rows.length > 0) {
        return await AuthService.createToken({
          _id: workshop.workshop_id,
          username: workshop.name,
          role: UserRole.WORKSHOP,
          wholesaler_id: workshop.wholesaler_id,
          customer_number: workshop.customer_number,
        })
      }

      const error = new Error('Ingen tilgang. Ta kontakt med grossist.')
      error.code = 403
      throw error
    }

    const error = new Error('Feil verkstednummer og/eller kundenummer')
    error.code = 401
    throw error
  } catch (e) {
    throw e
  }
}

/**
 * @param wholesalerId
 * @param appId
 */
async function addApp(wholesalerId, appId) {
  try {
    const query = `INSERT INTO wholesale_app (wholesaler_id, app_id) VALUES ($1, $2) RETURNING *`
    const result = await Db.query(query, [wholesalerId, appId])
    return result.rows
  } catch (e) {
    throw e
  }
}

/**
 * @param wholesaleId
 * @param appId
 * @returns {Promise<{name, active, id, wholesale_number, apps}>}
 */
async function removeApp(wholesaleId, appId) {
  try {
    const query = `DELETE FROM wholesale_app WHERE wholesaler_id=$1 AND app_id=$2`
    return await Db.query(query, [wholesaleId, appId])
  } catch (e) {
    throw e
  }
}

async function deleteAdItems(wholesaleId) {
  try {
    const query = `DELETE FROM ad_item WHERE wholesale_id=$1`
    await Db.query(query, [wholesaleId])
  } catch (e) {
    throw e
  }
}

/**
 * Sends a SNS message to trigger the autoDataUpdate Lambda found here:
 * https://eu-north-1.console.aws.amazon.com/lambda/home?region=eu-north-1#/functions/autoDataUpdate
 * Lambda Github repo: https://github.com/Cars-Web-Solutions/carsweb-ad-update-lambda
 */
async function triggerADItemsUpdate(wholesaleId) {
  return new Promise((resolve, reject) => {
    if (!AD_UPDATE_TOPIC_ARN) {
      return reject('No AD update topic arn set')
    }

    const params = {
      Message: wholesaleId,
      TopicArn: AD_UPDATE_TOPIC_ARN,
    }

    const publishPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise()

    publishPromise
      .then((data) => {
        console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`)
        console.log('MessageID is ' + data.MessageId)
        return resolve()
      })
      .catch((error) => {
        return reject({ message: error })
      })
  })
}

async function adItems(wholesaleId) {
  try {
    const countQuery = `
      SELECT COUNT(*) FROM ad_item
      WHERE wholesale_id=$1
    `

    const countResult = await Db.query(countQuery, [wholesaleId])
    const total = countResult.rows[0].count

    const query = `
      SELECT * FROM ad_item
      WHERE wholesale_id=$1
      LIMIT 10 OFFSET 0
    `
    const result = await Db.query(query, [wholesaleId])
    return {
      total,
      results: result.rows,
    }
  } catch (e) {
    throw e
  }
}

function getTireFileUploadUrl(wholesaleId) {
  return new Promise(async (resolve, reject) => {
    const wholesaler = await WholesaleService.findOne(wholesaleId)

    if (!wholesaler) {
      return reject('Wholesaler not found')
    }

    const wholesaleNumber = wholesaler.wholesale_number
    const key = `DEKK_${wholesaleNumber}.txt`

    const url = await S3BucketService.getPreSignedPutUrl(
      key,
      TIRES_BUCKET_NAME,
      'text/plain'
    ).catch((error) => reject(error))
    return resolve({ url })
  })
}

/**
 * Sends a SNS message to trigger the tireUpdate Lambda found here:
 * https://eu-north-1.console.aws.amazon.com/lambda/home?region=eu-north-1#/functions/tireUpdate
 * Lambda Github repo: https://github.com/Cars-Web-Solutions/carsweb-tire-update-lambda
 */
function updateTires(wholesaleId, articleGroups, leftOverStockGroups) {
  return new Promise(async (resolve, reject) => {
    if (!TIRE_UPDATE_TOPIC_ARN) {
      return reject('No tire update topic arn set')
    }

    const wholesaler = await findOne(wholesaleId)

    const params = {
      Message: wholesaleId,
      TopicArn: TIRE_UPDATE_TOPIC_ARN,
      MessageAttributes: {
        WholesaleNumber: {
          DataType: 'String',
          StringValue: wholesaler.wholesale_number.toString(),
        },
        ArticleGroups: {
          DataType: 'String.Array',
          StringValue: JSON.stringify(articleGroups),
        },
        LeftOverStockGroups: {
          DataType: 'String.Array',
          StringValue: JSON.stringify(leftOverStockGroups),
        },
      },
    }

    const publishPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise()

    publishPromise
      .then((data) => {
        console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`)
        console.log('MessageID is ' + data.MessageId)
        return resolve()
      })
      .catch((error) => {
        return reject({ message: error })
      })
  })
}
