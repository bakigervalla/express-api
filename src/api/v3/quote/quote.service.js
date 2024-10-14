const Db = require('../../../db/postgres-db')
const moment = require('moment')
const { v4: uuidv4 } = require('uuid')

/**
 * @exports QuoteService
 * @type {{create: create, findOne: findOne}}
 */
const QuoteService = {
  create,
  findOne: findOne,
  update: update,
}

module.exports = QuoteService

async function findOne(uuid) {
  try {
    const query = `SELECT * FROM quote WHERE uuid=$1`
    const result = await Db.query(query, [uuid])
    return result.rows.length > 0 ? _createQuoteObject(result.rows[0]) : null
  } catch (e) {
    throw e
  }
}

async function create(data) {
  try {
    const uuid = uuidv4()
    const query = `
      INSERT INTO quote 
      (uuid, order_id, regid, sename, sephone, cuname, cuphone, text, amount, duration, status, expires) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING *
    `
    const params = [
      uuid,
      data.orderid,
      data.regid,
      data.sename,
      data.sephone,
      data.cuname,
      data.cumobile,
      data.text,
      parseFloat(data.amount),
      data.duration,
      1,
      moment(Date.now()).add(data.duration, 'minutes').toDate(),
    ]
    const result = await Db.query(query, params)
    return _createQuoteObject(result.rows[0])
  } catch (e) {
    throw e
  }
}

async function update(uuid, data) {
  try {
    const query = `
      UPDATE quote 
      SET status=$2, booked=$3 
      WHERE uuid=$1 RETURNING *
    `
    const params = [uuid, data.status, moment().toDate()]
    const result = await Db.query(query, params)
    return _createQuoteObject(result.rows[0])
  } catch (e) {
    throw e
  }
}

function _createQuoteObject(data) {
  return {
    id: data.uuid,
    orderid: data.order_id,
    regid: data.regid,
    sename: data.sename,
    sephone: data.sephone,
    cuname: data.cuname,
    cumobile: data.cumobile,
    text: data.text,
    amount: data.amount,
    duration: data.duration,
    created: moment(data.created).valueOf(),
    booked: data.booked ? moment(data.booked).valueOf() : null,
    expires: moment(data.expires).valueOf(),
    status: data.status,
  }
}
