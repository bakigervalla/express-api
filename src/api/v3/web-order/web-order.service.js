const CONFIG = require('../../../config')
const nodemailer = require('nodemailer')
const Db = require('../../../db/postgres-db')
const WorkshopService = require('../workshop/workshop.service')

// Db WebOrder Table Columns
const columns = [
  'workshop_id',
  'first_name',
  'middle_name',
  'last_name',
  'phone',
  'email',
  'regno',
  'street',
  'zip',
  'city',
  'order_type_name',
  'order_type_duration',
  'request',
  'message',
  'fetched',
  'service_agreement',
]

const transporter = nodemailer.createTransport({
  host: CONFIG.AWS_EMAIL_SMTP,
  port: 465,
  secure: true,
  auth: {
    user: CONFIG.AWS_EMAIL_USERNAME,
    pass: CONFIG.AWS_EMAIL_PASSWORD,
  },
})

const WebOrderService = {
  sendEmail,
  create,
  findByDist,
  find,
  hasEmailSetting,
}

module.exports = WebOrderService

async function sendEmail(order) {
  try {
    return new Promise(async (resolve, reject) => {
      const workshop = await WorkshopService.findOne(order.workshop_id)

      if (workshop.email) {
        let emailText = `Ny ordre fra web\n\n! RegNr: ${order.regno}\nNavn: ${order.first_name} ${order.last_name}`
        emailText += `\nTelefon: ${order.phone}\nAdresse: ${order.street} ${order.zip} ${order.city}`
        emailText += `\nOrdretype: ${order.order_type_name}`

        if (order.request && order.request.length > 0) {
          emailText += `\nØnske om tidspunkt: ${order.request}`
        }
        if (order.message && order.message.length > 0) {
          emailText += `\n\nBeskjed: ${order.message}`
        }
        if (order.email && order.email.length > 0) {
          emailText += `\n\nE-post: ${order.email}`
        }

        const mailOptions = {
          from: 'timebestilling@bilxtraverksted.no',
          to: workshop.email,
          subject: 'Ny ordre fra websiden',
          text: emailText,
        }

        transporter.sendMail(mailOptions, (error) => {
          if (error) {
            console.error(error)
            return reject({ message: 'Unable to send e-mail', error: error })
          }

          return resolve('E-mail was sent')
        })
      } else {
        return reject('Verksted har ikke registrert e-postadresse')
      }
    })
  } catch (e) {
    throw e
  }
}

async function create(data, deliveryType) {
  try {
    const query = `INSERT INTO weborder
      (workshop_id, first_name, middle_name, last_name, phone, email, regno, street, zip, city, 
      order_type_name, order_type_duration, request, message, fetched, delivery, service_agreement) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
      RETURNING *`

    let values = [
      data.workshop_id,
      data.first_name,
      data.middle_name,
      data.last_name,
      data.phone,
      data.email,
      data.regno,
      data.street,
      data.zip,
      data.city,
      data.order_type_name,
      data.order_type_duration,
      data.request,
      data.message,
      false,
      deliveryType,
      data.service_agreement,
    ]

    const result = await Db.query(query, values)
    return result.rows[0]
  } catch (e) {
    throw e
  }
}

/**
 * This is used by Cars to get orders that will display in the board in Cars
 * @param dist
 * @param fetched
 * @param startAt
 * @returns {Promise<*>}
 */
async function findByDist(dist, fetched, startAt) {
  try {
    let params = [dist, fetched]

    let query = `
      SELECT wo.*, ws.dist FROM weborder AS wo 
      INNER JOIN workshops AS ws ON wo.workshop_id=ws.workshop_id
      WHERE ws.dist=$1 AND fetched=$2 AND delivery!='email'
    `

    if (startAt) {
      query += ` AND created_at >= $3`
      params = [dist, fetched, startAt]
    }

    const result = await Db.query(query, params)

    // Update fetched
    if (result.rows.length > 0) {
      const ids = result.rows.map((r) => r.workshop_id)
      const placeholders = result.rows.map((r, i) => `$${i + 1}`)
      const updateQuery = `UPDATE weborder SET fetched=true WHERE workshop_id IN(${placeholders})`
      await Db.query(updateQuery, [...ids])
    }

    return result.rows
  } catch (e) {
    throw e
  }
}

async function find(startAt, endAt) {
  try {
    let params = [startAt, endAt]

    const query = `
      SELECT w.dist, w.name, JSON_AGG(JSON_BUILD_OBJECT('created', wo.created_at, 'delivery', wo.delivery, 'service_agreement', wo.service_agreement)) AS orders
      FROM workshops w 
      LEFT JOIN weborder wo ON wo.workshop_id=w.workshop_id 
      WHERE wo.created_at >= $1 AND wo.created_at <= $2 
      GROUP BY w.workshop_id
    `

    const { rows } = await Db.query(query, params)
    return rows
  } catch (e) {
    throw e
  }
}

async function hasEmailSetting(workshopId) {
  try {
    const settingsQuery = `
      SELECT * 
      FROM app_setting AS settings 
      JOIN app_setting_workshop ON app_setting_workshop.app_setting_id=settings.app_setting_id 
      WHERE app_setting_workshop.workshop_id=$1 AND settings.key='SEND_EMAIL'
    `
    const result = await Db.query(settingsQuery, [workshopId])

    const hasEmailSetting = result.rows.length === 1
    return hasEmailSetting && result.rows[0].value === 'true'
  } catch (e) {
    throw e
  }
}
