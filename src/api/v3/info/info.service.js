const Db = require('../../../db/postgres-db')
const moment = require('moment')
const { v4: uuidv4 } = require('uuid')

/**
 * @exports InfoService
 * @type {{findOne: findOne, create: create, update: update}}
 */
const InfoService = {
  findOne,
  create,
  update,
}

module.exports = InfoService

async function findOne(uuid) {
  try {
    const query = `SELECT * FROM info WHERE uuid=$1`
    const result = await Db.query(query, [uuid])
    return result.rows.length > 0 ? _createInfoObject(result.rows[0]) : null
  } catch (e) {
    throw e
  }
}

async function create(data) {
  try {
    const uuid = uuidv4()
    const created = moment().toDate()
    const expires = moment().add(65, 'minutes').toDate()

    const query = `
      INSERT INTO info(uuid, expires, order_id, regid, sename, sephone, cuname, cumobile, result, created)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
    `

    const params = [
      uuid,
      expires,
      data.orderid,
      data.regid,
      data.sename,
      data.sephone,
      data.cuname,
      data.cumobile,
      data.result.map((r) => parseInt(r)),
      created,
    ]

    const results = await Db.query(query, params)
    return _createInfoObject(results.rows[0])
  } catch (e) {
    throw e
  }
}

async function update(uuid, data) {
  try {
    const query = `
      UPDATE info 
      SET booked=$2, orders=$3 
      WHERE uuid=$1
      RETURNING *
    `
    const params = [uuid, moment().toDate(), data.order.map((o) => parseInt(o))]
    const result = await Db.query(query, params)
    return _createInfoObject(result.rows[0])
  } catch (e) {
    throw e
  }
}

function _createInfoObject(data) {
  return {
    id: data.uuid,
    orderid: data.orderid,
    created: moment(data.created).valueOf(),
    expires: moment(data.expires).valueOf(),
    regid: data.regid,
    sename: data.sename,
    sephone: data.sephone,
    cuname: data.cuname,
    cumobile: data.cumobile,
    result: data.result.map((r) => r.toString()),
    order: data.orders ? data.orders.map((o) => o.toString()) : null,
    booked: data.booked ? moment(data.booked).valueOf() : null,
  }
}
