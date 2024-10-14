const Db = require('../../../db/postgres-db')

/**
 * @exports CollectionPageService
 * @type {{create: create, removePage: removePage, list: list, updatePage: updatePage,
 * addWorkshop: addWorkshop, removeWorkshop: removeWorkshop, removeParent: removeParent}}
 */
const CollectionPageService = {
  list,
  hierarchy,
  create,
  updatePage,
  removePage,
  listWorkshops,
  addWorkshop,
  removeWorkshop,
  findOne,
  removeParent,
}

module.exports = CollectionPageService

async function list(withWorkshops = false) {
  try {
    const query = withWorkshops
      ? `SELECT cp.*, ARRAY_AGG(w.workshop_id) AS workshops
         FROM collection_pages AS cp
         LEFT JOIN collection_pages_workshops cpw ON cpw.page_id=cp.page_id
         LEFT JOIN workshops w ON cpw.workshop_id=w.workshop_id
         GROUP BY cp.page_id
    `
      : `SELECT * FROM collection_pages ORDER BY name`
    const result = await Db.query(query)
    return result.rows
  } catch (e) {
    throw e
  }
}

async function hierarchy() {
  try {
    const query = `
      WITH RECURSIVE cte AS (
        SELECT parent_id, page_id, name, hidden, 1 AS level
        FROM collection_pages
        WHERE parent_id IS NULL
        UNION ALL
        SELECT cp.parent_id, cp.page_id, cp.name, cp.hidden, c.level + 1
        FROM cte c
        JOIN collection_pages cp ON cp.parent_id = c.page_id
      )
      SELECT * FROM cte
    `

    const result = await Db.query(query)
    return result.rows
  } catch (e) {
    throw e
  }
}

async function create(name, parentId = null, hidden) {
  try {
    const query = `
      INSERT INTO collection_pages (name, parent_id, hidden)
      VALUES ($1, $2, $3)
      RETURNING *
    `

    const params = [name, parentId, hidden]

    const result = await Db.query(query, params)
    return result.rows[0]
  } catch (e) {
    throw e
  }
}

async function updatePage(pageId, name, parentId, hidden) {
  try {
    const query =
      parentId || parentId === ''
        ? `
      UPDATE collection_pages SET name=$2, parent_id=$3, hidden=$4 WHERE page_id=$1 RETURNING *
    `
        : `
      UPDATE collection_pages SET name=$2, hidden=$3 WHERE page_id=$1 RETURNING *
    `

    const params =
      parentId === ''
        ? [pageId, name, null, hidden]
        : parentId
        ? [pageId, name, parentId, hidden]
        : [pageId, name, hidden]

    const result = await Db.query(query, params)
    return result.rows[0]
  } catch (e) {
    throw e
  }
}

async function removePage(pageId) {
  try {
    const query = `DELETE FROM collection_pages WHERE page_id=$1`

    const result = await Db.query(query, [pageId])
    return result.rows[0]
  } catch (e) {
    throw e
  }
}

async function listWorkshops(pageId) {
  try {
    const query = `
      SELECT w.workshop_id, w.name, w.slug, w.lat, w.long   
      FROM collection_pages_workshops AS cpw 
      LEFT JOIN workshops AS w ON cpw.workshop_id=w.workshop_id 
      WHERE cpw.page_id=$1 AND w.active=true
    `

    const params = [pageId]

    const result = await Db.query(query, params)
    return result.rows
  } catch (e) {
    throw e
  }
}

async function addWorkshop(pageId, workshopId) {
  try {
    const query = `
      INSERT INTO collection_pages_workshops(page_id, workshop_id)
      VALUES ($1, $2)
      RETURNING *
    `

    const params = [pageId, workshopId]

    const result = await Db.query(query, params)
    return result.rows[0]
  } catch (e) {
    throw e
  }
}

async function removeWorkshop(pageId, workshopId) {
  try {
    const query = `
      DELETE FROM collection_pages_workshops 
      WHERE page_id=$1 AND workshop_id=$2
    `

    const params = [pageId, workshopId]

    const result = await Db.query(query, params)
    return result.rows[0]
  } catch (e) {
    throw e
  }
}

async function findOne(pageId) {
  try {
    const query = `
      SELECT * FROM collection_pages WHERE page_id=$1 LIMIT 1
    `
    const result = await Db.query(query, [pageId])
    return result.rows[0]
  } catch (e) {
    throw e
  }
}

async function removeParent(pageId) {
  try {
    const query = `UPDATE collection_pages SET parent_id=null WHERE page_id=$1`
    await Db.query(query, [pageId])
    return await hierarchy()
  } catch (e) {
    throw e
  }
}
