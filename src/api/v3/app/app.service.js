const Db = require('../../../db/postgres-db')

// Db APp Table Columns
const columns = ['app_id', 'name', 'active']

const AppService = {
  create: create,
  all: all,
  findOne: findOne,
  update: update,
  consumers,
  deleteApp,
  appSettings,
  createAppSetting,
}

module.exports = AppService

async function create(data) {
  try {
    const query = 'INSERT INTO app (name, active) VALUES ($1, $2) RETURNING *'
    const result = await Db.query(query, [data.name, data.active])
    return result.rows[0]
  } catch (e) {
    throw e
  }
}

async function all() {
  try {
    const result = await Db.query('SELECT * FROM app')
    return result.rows
  } catch (e) {
    throw e
  }
}

async function findOne(id) {
  try {
    const result = await Db.query('SELECT * FROM app WHERE app_id=$1', [id])
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (e) {
    throw e
  }
}

async function update(id, data) {
  try {
    // Use only column keys
    const keys = Object.keys(data).filter((key) => columns.indexOf(key) !== -1)
    const params = keys.map((key, index) => `${key}=$${index + 1}`)

    // Use only column values
    let values = []
    keys.map((key) => (values = [...values, data[key]]))

    const query = `UPDATE app SET ${params.join(', ')} WHERE app_id=$${
      params.length + 1
    } RETURNING *`

    const result = await Db.query(query, [...values, id])
    return result.rows[0]
  } catch (e) {
    throw e
  }
}

async function consumers(id) {
  try {
    const workshopQuery = `
      SELECT w.workshop_id AS id, w.name, w.free_text AS has_free_text,
      w.dist AS code, COUNT(wi.image_url) AS image_count
      FROM workshop_app AS wa
      LEFT JOIN workshops AS w ON wa.workshop_id=w.workshop_id
      LEFT JOIN workshop_images AS wi ON wi.workshop_id=w.workshop_id and wi.image_url not like '%bildemangler%'
      WHERE app_id=$1
      GROUP BY w.workshop_id
      ORDER BY w.name ASC
    `
    const workshopResult = await Db.query(workshopQuery, [id])

    const wholesaleQuery = `
      SELECT w.wholesaler_id AS id, w.name, w.wholesale_number AS code
      FROM wholesale_app AS wa
      LEFT JOIN wholesaler AS w ON wa.wholesaler_id=w.wholesaler_id
      WHERE app_id=$1
      ORDER BY w.name ASC
    `
    const wholesaleResult = await Db.query(wholesaleQuery, [id])

    return [
      ...workshopResult.rows.map((w) => ({
        ...w,
        has_free_text: !!w.has_free_text,
        type: 'workshop',
      })),
      ...wholesaleResult.rows.map((w) => ({ ...w, type: 'wholesaler' })),
    ]
  } catch (e) {
    throw e
  }
}

async function deleteApp(id) {
  try {
    const query = `DELETE FROM app WHERE app_id=$1`

    await Db.query(query, [id])
    return { message: 'App deleted' }
  } catch (e) {
    throw e
  }
}

async function appSettings(id) {
  try {
    const query = `
      SELECT * FROM app_setting AS aps
      LEFT JOIN app AS a ON a.app_id=aps.app_id
      WHERE aps.app_id=$1
    `
    const result = await Db.query(query, [id])
    return result.rows
  } catch (e) {
    throw e
  }
}

async function createAppSetting(id, key) {
  try {
    const query = `INSERT INTO app_setting (app_id, key) VALUES ($1, $2)`
    const result = await Db.query(query, [id, key])
    return result.rows[0]
  } catch (e) {
    throw e
  }
}
