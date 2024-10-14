const Db = require('../../../db/postgres-db')

/**
 * @type {{myHistory: myHistory, historyByRegno: historyByRegno, create: create,
 * deleteHistoryForVehicle: deleteHistoryForVehicle}}
 */
const HistoryService = {
  all,
  create,
  historyByRegno,
  myHistory,
  findByCustomerPhone,
  deleteHistoryForVehicle,
}

module.exports = HistoryService

/**
 * @returns {Promise<*>}
 */
async function all() {
  try {
    const query = `SELECT * 
      FROM vehicle_history 
      WHERE INVOICE_DATE IS NOT NULL
      ORDER BY INVOICE_DATE DESC 
      LIMIT 10
    `
    const result = await Db.query(query)
    return result.rows
  } catch (e) {
    throw e
  }
}

/**
 * @param {object} data
 * @returns {Promise<{message: string}>}
 */
async function create(data) {
  try {
    data = Object.assign({}, data, { regno: data.regno.toUpperCase() })

    if (data.has_history) {
      await createHistory(data)
    }

    if (data.has_xtra) {
      await createOrUpdateXtra(data)
    }

    await createOrUpdateVehicle(data)

    return { message: 'Ok' }
  } catch (e) {
    throw e
  }
}

async function historyByRegno(regno) {
  try {
    regno = regno.toUpperCase()

    const vehicle = await getVehicleByRegno(regno)

    const historyQuery = `
        SELECT * FROM vehicle_history 
        WHERE regno=$1 AND duplicate=false
        ORDER BY invoice_date DESC`
    const historyResult = await Db.query(historyQuery, [regno])

    return {
      vehicle,
      history: historyResult.rows.map((h) => {
        delete h.customer_phone
        delete h.mechanic
        return h
      }),
    }
  } catch (e) {
    throw e
  }
}

async function myHistory(regno, phone) {
  try {
    const vehicle = await getVehicleByRegno(regno)

    const historyQuery = `
        SELECT * FROM vehicle_history 
        WHERE regno=$1 AND customer_phone=$2 AND duplicate=false 
        ORDER BY invoice_date DESC`

    const historyResult = await Db.query(historyQuery, [regno, phone])

    const xtraQuery = `SELECT * FROM xtra WHERE regno=$1 AND customer_phone=$2`
    const xtraResult = await Db.query(xtraQuery, [regno, phone])

    return {
      vehicle,
      history: historyResult.rows,
      xtra: xtraResult.rows.length > 0 ? xtraResult.rows[0] : null,
    }
  } catch (e) {
    throw e
  }
}

async function createHistory(data) {
  try {
    const query = `
      INSERT INTO vehicle_history (text, dist, invoice_date, invoice_no, mechanic, mileage, order_type, signature, regno, customer_phone, workshop_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `
    const values = [
      data.history.text.join('\n'),
      data.history.dist,
      data.history.invoice_date,
      data.history.invoice_no,
      data.history.mechanic,
      data.history.mileage,
      data.history.order_type,
      data.history.signature,
      data.regno,
      data.customer_phone,
      data.workshop_name,
    ]

    return await Db.query(query, values)
  } catch (e) {
    throw e
  }
}

async function createOrUpdateXtra(data) {
  try {
    const xtraQuery = `SELECT * FROM xtra WHERE customer_phone=$1`
    const xtraResult = await Db.query(xtraQuery, [data.customer_phone])

    let query

    if (xtraResult.rows.length === 1) {
      query = `
          UPDATE xtra SET comment=$1, p10=$2, p11=$3, p12=$4, p13=$5, p14=$6, p15=$7, p16=$8, p17=$9, p18=$10, p19=$11, p20=$12, p21=$13, p22=$14, p23=$15, p24=$16, p25=$17, p26=$18, p27=$19, p28=$20, p29=$21, p30=$22, regno=$23  
          WHERE customer_phone=$24
        `
    } else {
      query = `
          INSERT INTO xtra (comment, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26, p27, p28, p29, p30, regno, customer_phone) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
        `
    }

    const values = [
      data.xtra.comment,
      data.xtra.p10,
      data.xtra.p11,
      data.xtra.p12,
      data.xtra.p13,
      data.xtra.p14,
      data.xtra.p15,
      data.xtra.p16,
      data.xtra.p17,
      data.xtra.p18,
      data.xtra.p19,
      data.xtra.p20,
      data.xtra.p21,
      data.xtra.p22,
      data.xtra.p23,
      data.xtra.p24,
      data.xtra.p25,
      data.xtra.p26,
      data.xtra.p27,
      data.xtra.p28,
      data.xtra.p29,
      data.xtra.p30,
      data.regno,
      data.customer_phone,
    ]

    await Db.query(query, values)
  } catch (e) {
    throw e
  }
}

async function createOrUpdateVehicle(data) {
  try {
    const vehicle = await getVehicleByRegno(data.regno)

    if (!vehicle) {
      await createVehicle(data)
    } else {
      await updateVehicle(data)
    }
  } catch (e) {
    throw e
  }
}

async function updateVehicle(data) {
  try {
    const query = `UPDATE vehicle SET mob_expiry_date=$1, next_pkk_service=$2, next_service_date=$3, next_work_date=$4 WHERE regno=$5`
    const values = [
      data.mob_expiry_date || null,
      data.next_pkk_service || null,
      data.next_service_date || null,
      data.next_work_date || null,
      data.regno,
    ]
    return await Db.query(query, values)
  } catch (e) {
    throw e
  }
}

async function createVehicle(data) {
  try {
    const query = `
      INSERT INTO vehicle (regno, mob_expiry_date, next_pkk_service, next_service_date, next_work_date) 
      VALUES ($1, $2, $3, $4, $5)
    `
    const values = [
      data.regno,
      data.mob_expiry_date || null,
      data.next_pkk_service || null,
      data.next_service_date || null,
      data.next_work_date || null,
    ]
    return await Db.query(query, values)
  } catch (e) {
    throw e
  }
}

async function getVehicleByRegno(regno) {
  try {
    const query = `SELECT * FROM vehicle WHERE regno=$1 LIMIT 1`
    const result = await Db.query(query, [regno])

    return result.rows.length > 0 ? result.rows[0] : null
  } catch (e) {
    throw e
  }
}

async function findByCustomerPhone(phone) {
  try {
    const query = `SELECT * FROM vehicle_history WHERE customer_phone=$1`
    const result = await Db.query(query, [phone])

    return result.rows.length > 0 ? result.rows : null
  } catch (e) {
    throw e
  }
}

async function deleteHistoryForVehicle(phone) {
  try {
    const query = `DELETE FROM vehicle_history WHERE regno=$1`
    return await Db.query(query, [phone])
  } catch (e) {
    throw e
  }
}
