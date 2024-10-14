const Db = require('../../../db/postgres-db')
const moment = require('moment')
const { v4: uuidv4 } = require('uuid')

/**
 * @exports NoticeService
 * @type {{create: create, query: query, findOne: findOne}}
 */
const NoticeService = {
  create,
  query: query,
  update: update,
  findOne,
}

module.exports = NoticeService

async function create(data) {
  try {
    const uuid = uuidv4()
    const query = `
      INSERT INTO notice (uuid, cuname, cumobile, picture_id, regid, sename, sephone, text) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *
    `
    const params = [
      uuid,
      data.cuname,
      data.cumobile,
      data.pictureid,
      data.regid,
      data.sename,
      data.sephone,
      data.text,
    ]
    const result = await Db.query(query, params)
    return _createNoticeObject(result.rows[0])
  } catch (e) {
    throw e
  }
}

async function query(startDate, endDate, isSold) {
  try {
    const start = moment(startDate).startOf('day').toDate()
    const end = moment(endDate).endOf('day').toDate()

    const query = isSold
      ? `SELECT * FROM notice WHERE created >= $1 AND created <= $2 AND SOLD=$3`
      : `SELECT * FROM notice WHERE created >= $1 AND created <= $2`
    const result = await Db.query(query, [start, end])
    return result.rows.map((r) => _createNoticeObject(r))
  } catch (e) {
    throw e
  }
}

async function update(uuid, data) {
  try {
    const query = data.new_reg_id
      ? `UPDATE notice SET sold=$2, updated=$3, new_regid=$4 WHERE uuid=$1 RETURNING *`
      : `UPDATE notice SET sold=$2, updated=$3 WHERE uuid=$1 RETURNING *`

    const params = data.new_reg_id
      ? [uuid, data.is_sold, moment().toDate(), data.new_reg_id]
      : [uuid, data.is_sold, moment().toDate()]

    const result = await Db.query(query, params)
    return _createNoticeObject(result.rows[0])
  } catch (e) {
    throw e
  }
}

async function findOne(uuid) {
  try {
    const query = `SELECT * FROM notice WHERE uuid=$1 LIMIT 1`
    const result = await Db.query(query, [uuid])
    return result.rows.length > 0 ? _createNoticeObject(result.rows[0]) : null
  } catch (e) {
    throw e
  }
}

function _createNoticeObject(data) {
  return {
    id: data.uuid,
    regid: data.regid,
    sename: data.sename,
    sephone: data.sephone,
    cuname: data.cuname,
    cumobile: data.cumobile,
    pictureid: data.picture_id,
    text: data.text,
    is_sold: data.sold || false,
    created: data.created,
    new_reg_id: data.new_regid,
  }
}
