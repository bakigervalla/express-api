const VehicleService = require('./vehicle.service')
const HelperService = require('../../common/helper.service')
var request = require('request')

const VehicleController = {
  getAll,
  getVehicleByRegNo: getVehicleByRegNo,
  getVehiclesByPhone,
  updateVehicleSettings,
  getPersonByPhone,
}

module.exports = VehicleController

async function getAll(req, res) {
  try {
    const data = await VehicleService.getAll()
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function getVehicleByRegNo(req, res) {
  try {
    const data = await VehicleService.getVehicleByRegNo(req.params.regno)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function getVehiclesByPhone(req, res) {
  try {
    const data = await VehicleService.getVehicleByPhoneNo(req.params.phone)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function updateVehicleSettings(req, res) {
  try {
    const data = await VehicleService.updateVehicleSettings(
      req.params.regno,
      req.body.phone,
      req.body.active,
      req.body.description
    )
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

function getPersonByPhone(req, res) {
  try {
    let url = ``

    request({
      uri: url,
    }).pipe(res)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}
