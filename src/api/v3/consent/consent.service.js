const Db = require('../../../db/postgres-db')
const moment = require('moment')
const { v4: uuidv4 } = require('uuid')

const ConsentService = {
  findOne,
  update: update,
  create: create,
  list: list,
}

module.exports = ConsentService

/**
 * @param {string} uuid
 * @returns {Promise<*>}
 */
async function findOne(uuid) {
  try {
    const query = `SELECT * FROM consent WHERE uuid=$1`
    const result = await Db.query(query, [uuid])
    return result.rows.length > 0 ? _createConsentObject(result.rows[0]) : null
  } catch (e) {
    throw e
  }
}

async function update(uuid, data) {
  try {
    const query = `
      UPDATE consent 
      SET market_info_sms=$2, market_info_mail=$3, reminder_sms=$4, reminder_mail=$5, service_sms=$6, service_mail=$7, answered=$8 
      WHERE uuid=$1 
      RETURNING *
    `
    const params = [
      uuid,
      data.market_info_sms,
      data.market_info_mail,
      data.reminder_sms,
      data.reminder_mail,
      data.service_sms,
      data.service_mail,
      moment().toDate(),
    ]

    const result = await Db.query(query, params)
    return _createConsentObject(result.rows[0])
  } catch (e) {
    throw e
  }
}

/**
 * @param {object} data
 * @returns {Promise<{id: *}>}
 */
async function create(data) {
  try {
    const uuid = uuidv4()

    const query = `
      INSERT INTO consent(uuid, cumobile, cuname, cuno, dist, sename, sephone) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `
    const params = [
      uuid,
      data.cumobile,
      data.cuname,
      data.cuno,
      data.dist,
      data.sename,
      data.sephone,
    ]
    const result = await Db.query(query, params)
    return result.rows[0]
  } catch (e) {
    throw e
  }
}

async function list(dist, fetched = false) {
  try {
    const query = `SELECT * FROM consent WHERE dist=$1 AND fetched=$2`
    const result = await Db.query(query, [dist, fetched])

    // Update fetched
    if (result.rows.length > 0) {
      const ids = result.rows.map((r) => r.uuid)
      const placeholders = result.rows.map((r, i) => `$${i + 1}`)
      const updateQuery = `UPDATE consent SET fetched=true WHERE uuid IN(${placeholders})`
      await Db.query(updateQuery, [...ids])
    }

    return result.rows.map((row) => _createConsentObject(row))
  } catch (e) {
    // throw (e);
    console.log(e)
  }
}

function _createConsentObject(data) {
  return {
    id: data.uuid,
    cumobile: data.cumobile,
    cuname: data.cuname,
    cuno: data.cuno,
    dist: data.dist,
    sename: data.sename,
    sephone: data.sephone,
    created: data.created,
    fetched: data.fetched,
    answered: data.answered,
    market_info_sms: data.market_info_sms,
    market_info_mail: data.market_info_mail,
    reminder_sms: data.reminder_sms,
    reminder_mail: data.reminder_mail,
    service_sms: data.service_sms,
    service_mail: data.service_mail,
  }
}
