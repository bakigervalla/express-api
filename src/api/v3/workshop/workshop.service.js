const Db = require('../../../db/postgres-db')

// Db Workshop Table Columns
const columns = [
  'workshop_id',
  'dist',
  'name',
  'slug',
  'street',
  'zip',
  'city',
  'county',
  'lat',
  'long',
  'email',
  'phone',
  'facebook',
  'homepage',
  'free_text',
  'active',
  'customer_number',
  'workshop_number',
  'wholesaler_id',
  'opening_hours',
  'affiliation',
  'instagram_url',
]

const WorkshopService = {
  all,
  findOne,
  images,
  addImage,
  deleteImage,
  imagesByWorkshop,
  listApp,
  addApp,
  removeApp,
  update,
  create,
  findBySlug,
  search,
  remove,
  getMeta,
  updateMeta,
  listAppSettings,
  updateAppSetting,
  listCollectionPages,
  listHistoryByDist,
  deleteHistoryByDist,
}

module.exports = WorkshopService

async function all(queryParam) {
  try {
    let result = { rows: [] }

    if (queryParam && Object.keys(queryParam)[0] === 'appId') {
      const appId = Object.values(queryParam)[0]

      const query = `
        SELECT w.*, meta.title AS meta_title, cp2.name AS affiliation_name, ARRAY_AGG(cp.page_id) AS collection_pages
        FROM workshops w
        LEFT JOIN workshop_app a ON a.workshop_id=w.workshop_id 
        LEFT JOIN workshop_meta meta ON a.workshop_id=meta.workshop_id
        LEFT JOIN collection_pages_workshops cpw ON w.workshop_id=cpw.workshop_id
        LEFT JOIN collection_pages cp ON cp.page_id=cpw.page_id
        LEFT JOIN collection_pages cp2 ON cp2.page_id=w.affiliation
        WHERE a.app_id=$1
        GROUP BY w.workshop_id, meta.title, cp2.name
        ORDER BY w.name ASC
      `

      result = await Db.query(query, [appId])

      const placeholders = result.rows.map((r) => r.workshop_id)

      if (placeholders.length > 0) {
        const elApprovedQuery = `
        SELECT app_setting_workshop.workshop_id, app_setting.key, app_setting_workshop.value 
        FROM app_setting 
        LEFT JOIN app_setting_workshop ON app_setting_workshop.app_setting_id=app_setting.app_setting_id 
        WHERE app_setting_workshop.workshop_id IN (${placeholders}) AND app_setting.app_setting_id=$1
      `

        const elApprovedResult = await Db.query(elApprovedQuery, [2])

        return result.rows.map((workshop) => {
          return {
            ...workshop,
            collection_pages: workshop.collection_pages.filter((c) => c !== null),
            settings: elApprovedResult.rows.filter(
              (setting) => setting.workshop_id === workshop.workshop_id
            ),
          }
        })
      }

      return result.rows.map((workshop) => {
        return {
          ...workshop,
          collection_pages: workshop.collection_pages.filter((c) => c !== null),
          settings: {},
        }
      })
    } else {
      const query = `
        SELECT w1.*, w2.name AS wholesaler_name
        FROM workshops AS w1
        LEFT JOIN wholesaler AS w2 ON w1.wholesaler_id=w2.wholesaler_id
    `

      const result = await Db.query(query)
      return result.rows
    }
  } catch (e) {
    throw e
  }
}

async function findOne(id) {
  try {
    const query = `SELECT w1.*, w2.name AS wholesaler_name FROM workshops AS w1 LEFT JOIN wholesaler AS w2 ON w1.wholesaler_id=w2.wholesaler_id WHERE w1.workshop_id=$1 LIMIT 1`
    const result = await Db.query(query, [id])
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (e) {
    throw e
  }
}

async function images() {
  try {
    const query = `SELECT * FROM workshop_images`
    const result = await Db.query(query)
    return result.rows
  } catch (e) {
    throw e
  }
}

async function addImage(id, imageUrl) {
  try {
    const query = `INSERT INTO workshop_images(workshop_id, image_url) VALUES ($1, $2) RETURNING *`
    return await Db.query(query, [id, imageUrl])
  } catch (e) {
    throw e
  }
}

async function deleteImage(id, imageId) {
  try {
    const query = `DELETE FROM workshop_images WHERE workshop_id=$1 AND image_id=$2`
    return await Db.query(query, [id, imageId])
  } catch (e) {
    throw e
  }
}

async function imagesByWorkshop(workshopId) {
  try {
    const query = `SELECT * FROM workshop_images WHERE workshop_id=$1`
    const result = await Db.query(query, [workshopId])

    return result.rows.length > 0 ? result.rows : []
  } catch (e) {
    throw e
  }
}

async function listApp(workshopId) {
  try {
    const query = `
      SELECT app.* 
      FROM workshop_app AS wa 
      INNER JOIN app ON app.app_id = wa.app_id 
      WHERE wa.workshop_id = $1
    `
    const result = await Db.query(query, [workshopId])

    return result.rows.length > 0 ? result.rows : []
  } catch (e) {
    throw e
  }
}

async function addApp(workshopId, appId) {
  try {
    const query = `INSERT INTO workshop_app (workshop_id, app_id) VALUES ($1, $2) RETURNING *`
    const result = await Db.query(query, [workshopId, appId])
    return result.rows
  } catch (e) {
    throw e
  }
}

async function removeApp(workshopId, appId) {
  try {
    const query = `DELETE FROM workshop_app WHERE workshop_id=$1 AND app_id=$2`
    return await Db.query(query, [workshopId, appId])
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

    const query = `UPDATE workshops SET ${params.join(', ')} WHERE workshop_id=$${
      params.length + 1
    } RETURNING *`

    const result = await Db.query(query, [...values, id])
    return result.rows[0]
  } catch (e) {
    throw e
  }
}

async function create(data) {
  try {
    const keys = Object.keys(data)
    const params = keys.map((k, index) => `$${index + 1}`)
    const values = Object.values(data)

    const query = `INSERT INTO workshops(${keys.join(', ')}) VALUES (${params.join(
      ', '
    )}) RETURNING *`
    const result = await Db.query(query, values)
    return result.rows[0]
  } catch (e) {
    throw e
  }
}

async function findBySlug(slug) {
  try {
    const query = `SELECT w1.*, w2.name AS wholesaler_name FROM workshops AS w1 INNER JOIN wholesaler AS w2 ON w1.wholesaler_id=w2.wholesaler_id WHERE w1.slug=$1 LIMIT 1`
    const result = await Db.query(query, [slug])
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (e) {
    throw e
  }
}

async function search(term, appId) {
  try {
    let query = `
      SELECT *
      FROM workshops
      WHERE name ILIKE '%${term}%' OR county ILIKE '${term}%' OR city ILIKE '${term}%' OR street ILIKE '${term}%'
    `

    let params = []

    if (appId) {
      query = `
        SELECT w.*
        FROM workshop_app AS wa
        LEFT JOIN workshops AS w ON wa.workshop_id=w.workshop_id
        WHERE app_id=$1
        AND name ILIKE '%${term}%' OR county ILIKE '${term}%' OR city ILIKE '${term}%' OR street ILIKE '${term}%'
        GROUP BY w.workshop_id
        ORDER BY w.name ASC
      `

      params = [appId]
    }

    const result = await Db.query(query, params)
    return result.rows
  } catch (e) {
    throw e
  }
}

async function remove(workshopId) {
  try {
    const query = `DELETE FROM workshops WHERE workshop_id=$1`
    return await Db.query(query, [workshopId])
  } catch (e) {
    throw e
  }
}

async function getMeta(workshopId) {
  try {
    const query = `SELECT * FROM workshop_meta WHERE workshop_id=$1`
    const result = await Db.query(query, [workshopId])
    return result.rows.length > 0 ? result.rows[0] : ''
  } catch (e) {
    throw e
  }
}

async function updateMeta(workshopId, data) {
  try {
    const metaQuery = `SELECT * FROM workshop_meta WHERE workshop_id=$1`
    const metaResult = await Db.query(metaQuery, [workshopId])

    let query

    if (metaResult.rows.length === 0) {
      query = `INSERT INTO workshop_meta(workshop_id, title) VALUES ($1, $2)`
    } else {
      query = `UPDATE workshop_meta SET title=$2 WHERE workshop_id=$1`
    }

    await Db.query(query, [workshopId, data.title])
  } catch (e) {
    throw e
  }
}

async function listAppSettings(workshopId) {
  try {
    const query = `
      SELECT apsw.*, a.name, a.app_id, aps.key
      FROM app_setting_workshop AS apsw
      LEFT JOIN app_setting AS aps ON aps.app_setting_id=apsw.app_setting_id 
      LEFT JOIN app AS a ON a.app_id=aps.app_id 
      WHERE workshop_id=$1
    `
    const result = await Db.query(query, [workshopId])
    return result.rows
  } catch (e) {
    throw e
  }
}

async function updateAppSetting(workshopId, appSettingId, value) {
  try {
    const query = `SELECT * FROM app_setting_workshop WHERE workshop_id=$1 AND app_setting_id=$2`
    const result = await Db.query(query, [workshopId, appSettingId])

    if (result.rows.length > 0) {
      // Update
      const query = `UPDATE app_setting_workshop SET value=$3 WHERE workshop_id=$1 AND app_setting_id=$2`
      await Db.query(query, [workshopId, appSettingId, value])
    } else {
      // Create
      const query = `INSERT INTO app_setting_workshop (app_setting_id, workshop_id, value) VALUES ($1, $2, $3)`
      await Db.query(query, [appSettingId, workshopId, value])
    }

    return await listAppSettings(workshopId)
  } catch (e) {
    throw e
  }
}

async function listCollectionPages(workshopId) {
  try {
    const query = `
      SELECT cp.page_id, cp.name AS page_name  
      FROM collection_pages_workshops AS cpw 
      LEFT JOIN collection_pages AS cp ON cp.page_id=cpw.page_id 
      WHERE workshop_id=$1
    `
    const result = await Db.query(query, [workshopId])
    return result.rows
  } catch (e) {
    throw e
  }
}

async function listHistoryByDist(dist) {
  try {
    const query = `
      SELECT * FROM vehicle_history 
      WHERE dist=$1
      ORDER BY invoice_date
      LIMIT 20 
    `
    const result = await Db.query(query, [dist])
    return { results: result.rows }
  } catch (e) {
    throw e
  }
}

async function deleteHistoryByDist(dist) {
  try {
    const query = `DELETE FROM vehicle_history WHERE dist=$1`
    await Db.query(query, [dist])
    return { results: [] }
  } catch (e) {
    throw e
  }
}
