const axios = require('axios')
const xml2js = require('xml2js')
const parser = new xml2js.Parser()
const Db = require('../../../db/postgres-db')
const logger = require('../../../logger')
const { AUTODATA_URL } = require('../../../config')

const AdItemService = {
  searchByWholesale,
  getDetails,
  searchDetails,
  sendOrder,
  orders,
  scan,
}

module.exports = AdItemService

async function searchByWholesale(wholesaleId, term, limit = 10, offset = 0, field) {
  try {
    const totalQuery =
      field === 'description'
        ? `SELECT COUNT(*) AS total FROM ad_item WHERE LOWER(description) LIKE LOWER('%${term}%') AND wholesale_id=$1`
        : `SELECT COUNT(*) AS total FROM ad_item WHERE LOWER(article_number_search) LIKE LOWER('${term}%') AND wholesale_id=$1`

    const totalResult = await Db.query(totalQuery, [wholesaleId])

    const query =
      field === 'description'
        ? `SELECT * FROM ad_item WHERE LOWER(description) LIKE LOWER('%${term}%') AND wholesale_id=$1 LIMIT $2 OFFSET $3`
        : `SELECT * FROM ad_item WHERE LOWER(article_number_search) LIKE LOWER('${term}%') AND wholesale_id=$1 LIMIT $2 OFFSET $3`

    const result = await Db.query(query, [wholesaleId, limit, offset])

    return {
      total: parseInt(totalResult.rows[0].total),
      results: result.rows,
    }
  } catch (e) {
    throw e
  }
}

async function getDetails(articleNumberWithAlpha, customerNumber) {
  try {
    const query = `
      SELECT w.*, ws.wholesale_number, ws.name AS wholesale_name  
      FROM workshops AS w 
      LEFT JOIN wholesaler AS ws ON w.wholesaler_id = ws.wholesaler_id 
      WHERE w.customer_number=$1
    `

    const result = await Db.query(query, [customerNumber])

    if (result.rows.length > 0) {
      const workshop = result.rows[0]

      const wholesaleNumber = workshop.wholesale_number

      const response = await axios({
        url: `${AUTODATA_URL}/cars9000/qpc_beh.php`,
        method: 'get',
        params: {
          lev: wholesaleNumber,
          knr: customerNumber,
          art: articleNumberWithAlpha,
        },
      })

      return await new Promise((resolve, reject) => {
        parser.parseString(response.data, (err, result) => {
          if (result && result.xml) {
            const parsed = result.xml.autodata[0][`lev${wholesaleNumber}`][0]['post'][0]
            return resolve({
              name: parsed['navn'][0],
              artnr: parsed['artnr'][0],
              available: parseInt(parsed['antall'][0]),
              net: parseInt(parsed['netto'][0]),
              gross: parseInt(parsed['brutto'][0]),
            })
          }

          return reject('Unavailable')
        })
      })
    }

    throw new Error('Workshop or Wholesaler not found')
  } catch (e) {
    if (e === 'Unavailable') {
      e = new Error('Unavailable')
      e.code = 503
    }

    throw e
  }
}

async function searchDetails(data) {
  try {
    const { customerNumber, articleNumberWithAlpha } = data

    const query = `
      SELECT w.*, ws.wholesale_number, ws.name AS wholesale_name  
      FROM workshops AS w 
      LEFT JOIN wholesaler AS ws ON w.wholesaler_id = ws.wholesaler_id 
      WHERE w.customer_number=$1
    `

    const result = await Db.query(query, [customerNumber])

    if (result.rows.length > 0) {
      const workshop = result.rows[0]

      const wholesaleNumber = workshop.wholesale_number

      const response = await axios({
        url: `${AUTODATA_URL}/cars9000/qpc_beh.php`,
        method: 'get',
        params: {
          lev: wholesaleNumber,
          knr: customerNumber,
          art: articleNumberWithAlpha,
        },
      })

      return await new Promise((resolve, reject) => {
        parser.parseString(response.data, (err, result) => {
          if (result && result.xml) {
            const list = result.xml.autodata[0][`lev${wholesaleNumber}`][0]['post']

            const json = list.map((itm) => {
              return {
                name: itm.navn[0],
                alfa: itm.alfa[0],
                artnr: itm.artnr[0],
                article_with_alfa: `${itm.alfa[0]}${itm.artnr[0]}`,
                available: parseInt(itm.antall[0]),
                net: parseInt(itm.netto[0]),
                gross: parseInt(itm.brutto[0]),
              }
            })
            return resolve(json)
          }
          return reject('Unavailable')
        })
      })
    }

    throw new Error('Workshop or Wholesaler not found')
  } catch (e) {
    if (e === 'Unavailable') {
      e = new Error('Unavailable')
      e.code = 503
    }

    throw e
  }
}

async function sendOrder(data) {
  try {
    const query1 = `
      SELECT w.*, ws.wholesale_number, ws.name AS wholesale_name  
      FROM workshops AS w 
      LEFT JOIN wholesaler AS ws ON w.wholesaler_id = ws.wholesaler_id 
      WHERE w.customer_number=$1 AND ws.wholesaler_id=$2
    `
    const params = [data.customer_number, data.wholesale_id]
    const result1 = await Db.query(query1, params)

    if (result1.rows.length === 0) {
      const error = new Error('Verksted er ikke kunde av denne grossisten')
      error.code = 403
      throw error
    }

    const logData = result1.rows[0]

    await sendOrderToAutoData(
      data.wholesale_id,
      logData.wholesale_number,
      data.rows,
      data.customer_number,
      data.requisition_number,
      data.text || data.rows[0].text
    )

    const orderQuery = `
      INSERT INTO ad_item_order (wholesale_id, workshop_id, app_id) 
      VALUES ($1, $2, $3)
    `
    const orderParams = [data.wholesale_id, logData.workshop_id, data.app_id]
    await Db.query(orderQuery, orderParams)

    return 'Ordre sent'
  } catch (e) {
    throw e
  }
}

async function orders(wholesaleId, start, end) {
  try {
    const query = `
      SELECT aio.*, ws.name AS workshop_name, a.name AS app_name 
      FROM ad_item_order AS aio 
      LEFT JOIN workshops AS ws ON aio.workshop_id=ws.workshop_id
      LEFT JOIN wholesaler AS w ON aio.wholesale_id=w.wholesaler_id
      LEFT JOIN app AS a ON aio.app_id=a.app_id
      WHERE created_at > $1 AND created_AT < $2 AND w.wholesaler_id=$3
    `
    const result = await Db.query(query, [start, end, wholesaleId])

    return {
      total: result.rows.length,
      results: result.rows,
    }
  } catch (e) {
    throw e
  }
}

async function scan(wholesaleId, barcode) {
  try {
    const query = `SELECT * FROM ad_item WHERE wholesale_id=$1 AND barcode=$2 LIMIT 10`
    const result = await Db.query(query, [wholesaleId, barcode])
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (e) {
    throw e
  }
}

async function sendOrderToAutoData(
  wholesaleId,
  wholesaleNumber,
  orderRows,
  customerNumber,
  requisitionNumber = '',
  text
) {
  try {
    const insertAt = (str, sub, pos) => `${str.slice(0, pos)}${sub}${str.slice(pos)}`

    const numRows = orderRows.length < 10 ? `0${orderRows.length}` : orderRows.length
    let url = `${AUTODATA_URL}/cars9000/qpc_bestill.php?lev=${wholesaleNumber}&knr=${customerNumber}&rader=${numRows}&`
    const rows = orderRows.map((row, index) => {
      const rowIndex = index + 1 < 10 ? `0${index + 1}` : index + 1
      return `vare${rowIndex}=${insertAt(row.article_number, '|', 3)}|${row.amount},00`
    })

    const encodedText = text ? encodeURIComponent(text) : ''

    url += `${rows.join('&')}&merknad=${encodedText}&rekv=${requisitionNumber}&frakt=`

    const response = await axios({ url: url, method: 'get' })

    logger.info('Sending order to Auto Data:')
    logger.info(url)

    return await new Promise((resolve, reject) => {
      parser.parseString(response.data, async (err, result) => {
        if (result && result.xml) {
          const error = result.xml.autodata[0]['FEIL']

          if (error) {
            return reject(error[0])
          }

          logger.info(JSON.stringify(result.xml.autodata))

          return resolve('Ordre sent!')
        }

        return reject('Unavailable')
      })
    })
  } catch (e) {
    throw e
  }
}
