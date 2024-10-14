const CONFIG = require('../../../config')
const Db = require('../../../db/postgres-db')

// Db Services Table Columns
const serviceFields = ['category_id', 'code', 'name', 'description', 'duration', 'is_active']

// Db Categories Table Columns
const categoryFields = ['workshop_id', 'name', 'description', 'is_active']

const ServicesService = {
  create,
  remove,
  update,
  getServices,
  createCategory,
  removeCategory,
  updateCategory,
  getCategories,
}

module.exports = ServicesService

async function create(data) {
  try {
    const keys = Object.keys(data)
    const params = keys.map((k, index) => `$${index + 1}`)
    const values = Object.values(data)

    const query = `INSERT INTO services(${keys.join(', ')}) VALUES (${params.join(
      ', '
    )}) RETURNING *`
    const result = await Db.query(query, values)
    return result.rows[0]
  } catch (e) {
    throw e
  }
}

async function remove(id) {
  try {
    const query = `DELETE FROM services WHERE id=$1`
    return await Db.query(query, [id])
  } catch (e) {
    throw e
  }
}

async function update(id, data) {
  try {
    // Use only column keys
    const keys = Object.keys(data).filter((key) => serviceFields.indexOf(key) !== -1)
    const params = keys.map((key, index) => `${key}=$${index + 1}`)

    // Use only column values
    let values = []
    keys.map((key) => (values = [...values, data[key]]))

    const query = `UPDATE services SET ${params.join(', ')} WHERE id=$${
      params.length + 1
    } RETURNING *`

    const result = await Db.query(query, [...values, id])
    return result.rows[0]
  } catch (e) {
    throw e
  }
}

async function getServices(workshopId) {
  try {
    const query = `
        SELECT 'service' as type, s.id, c.id category_id, s.code, c.workshop_id, s.name, s.description, s.duration, s.is_active, s.created_at
        FROM services AS s
        INNER JOIN categories c ON s.category_id = c.id 
        WHERE c.workshop_id = $1
        UNION ALL
        SELECT 'category' as type, id, null, null, workshop_id, name, description, 0, is_active, created_at
        FROM categories
        WHERE workshop_id = $1
    `
    const result = await Db.query(query, [workshopId])

    return result.rows.length > 0 ? result.rows : []
  } catch (e) {
    throw e
  }
}

// Categories

async function createCategory(data) {
  try {
    const keys = Object.keys(data)
    const params = keys.map((k, index) => `$${index + 1}`)
    const values = Object.values(data)

    const query = `INSERT INTO categories(${keys.join(', ')}) VALUES (${params.join(
      ', '
    )}) RETURNING *`
    const result = await Db.query(query, values)
    return result.rows[0]
  } catch (e) {
    throw e
  }
}

async function removeCategory(id) {
  try {
    const query = `DELETE FROM categories WHERE id=$1`
    return await Db.query(query, [id])
  } catch (e) {
    throw e
  }
}

async function updateCategory(id, data) {
  try {
    // Use only column keys
    const keys = Object.keys(data).filter((key) => categoryFields.indexOf(key) !== -1)
    const params = keys.map((key, index) => `${key}=$${index + 1}`)

    // Use only column values
    let values = []
    keys.map((key) => (values = [...values, data[key]]))

    const query = `UPDATE categories SET ${params.join(', ')} WHERE id=$${
      params.length + 1
    } RETURNING *`

    const result = await Db.query(query, [...values, id])
    return result.rows[0]
  } catch (e) {
    throw e
  }
}

async function getCategories(workshopId) {
  try {
    const query = `
        SELECT *
        FROM categories
        WHERE workshop_id = $1
        `
    const result = await Db.query(query, [workshopId])

    return result.rows.length > 0 ? result.rows : []
  } catch (e) {
    throw e
  }
}
