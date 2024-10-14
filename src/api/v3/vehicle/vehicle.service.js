const soap = require('soap')
const HistoryService = require('../history/history.service')
const Db = require('../../../db/postgres-db')
const { v4: uuidv4 } = require('uuid')

soap.WSDL.prototype.ignoredNamespaces = []

const VehicleService = {
  getAll,
  getVehicleByRegNo,
  getVehicleByPhoneNo,
  updateVehicleSettings,
}

module.exports = VehicleService

async function getAll() {
  try {
    const query = `SELECT COUNT(*) FROM vehicle`
    const result = await Db.query(query)
    return result.rows
  } catch (e) {
    throw e
  }
}

function getVehicleByRegNo(regno) {
  return new Promise((resolve, reject) => {
    const user = 'cars00010'
    const url = 'http://app.pkk.no/ems?wsdl'
    const args = {
      username: user,
      password: user,
      country: '47',
      type: '0',
      regnr: regno,
    }

    soap.createClient(url, (error, client) => {
      if (error) {
        return reject(error)
      }

      client.emsService.emsPort.vkData(args, (error, result, raw, soapHeader) => {
        if (error) {
          return reject(error)
        }

        return resolve(result['return'])
      })
    })
  })
}

async function getVehicleByPhoneNo(phone) {
  try {
    // Find all history with customer phone number
    const history = await HistoryService.findByCustomerPhone(phone)

    let result = []

    if (history && history.length > 0) {
      let regNums = history.map((h) => h.regno)
      regNums = [...new Set(regNums)]

      // Get vehicle info from statens vegvesen
      const promises = regNums.map((r) => VehicleService.getVehicleByRegNo(r))
      let data = await Promise.all(promises)
      data = data.map((res) => ({
        kjennemerke: res.kjennemerke,
        farge: res.farge,
        merkeNavn: res.merkeNavn,
        modellbetegnelse: res.modellbetegnelse,
        nestePKK: res.nestePKK,
        regAAr: res.regAAr,
        sistPKKgodkj: res.sistPKKgodkj,
        rammeKarosseri: res.rammeKarosseri,
      }))

      const placeholders = regNums.map((r, i) => `$${i + 1}`)

      // Get vehicle info from our database
      const vehicleQuery = `SELECT * FROM vehicle WHERE regno IN(${placeholders})`
      const vehicleResult = await Db.query(vehicleQuery, [...regNums])
      const vehicles = vehicleResult.rows

      // Get vehicle settings
      const vehicleSettingsQuery = `
        SELECT *
        FROM vehicle_settings
        WHERE regno IN(${placeholders}) AND phone=$${placeholders.length + 1}
      `
      const vehicleSettingsResult = await Db.query(vehicleSettingsQuery, [...regNums, phone])
      const vehicleSettings = vehicleSettingsResult.rows

      // Add Statens Vegvesen data to vehicle
      result = vehicles.map((vehicle) => {
        const vehicleData = data.filter((d) => d.kjennemerke === vehicle.regno)
        const settings = vehicleSettings.filter((settings) => settings.regno === vehicle.regno)

        return {
          vehicle,
          data: vehicleData.length > 0 ? vehicleData[0] : null,
          settings: settings.length > 0 ? settings[0] : { active: true, description: '' },
        }
      })
    }

    return result
  } catch (e) {
    throw e
  }
}

async function updateVehicleSettings(regno, phone, active, description) {
  try {
    const uuid = uuidv4()

    const check = `SELECT * FROM vehicle_settings WHERE regno=$1 AND phone=$2`
    const checkResult = await Db.query(check, [regno, phone])
    const exists = checkResult.rows.length > 0

    const query = exists
      ? `UPDATE vehicle_settings SET active=$3, description=$4 WHERE regno=$1 AND phone=$2 RETURNING *`
      : `INSERT INTO vehicle_settings (regno, phone, active, description, uuid) VALUES ($1, $2, $3, $4, $5) RETURNING *`
    const params = exists
      ? [regno, phone, active, description]
      : [regno, phone, active, description, uuid]

    const result = await Db.query(query, params)
    return result.rows[0]
  } catch (e) {
    throw e
  }
}
