const HistoryService = require('./history.service')
const HelperService = require('../../common/helper.service')

/**
 * @type {{create: create, historyByRegno: historyByRegno, myHistory: myHistory,
 * deleteHistoryForVehicle: deleteHistoryForVehicle}}
 */
const HistoryController = {
  all,
  create,
  historyByRegno,
  myHistory,
  deleteHistoryForVehicle,
}

module.exports = HistoryController

async function all(req, res) {
  try {
    const data = await HistoryService.all()
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function create(req, res) {
  try {
    const data = await HistoryService.create(req.body)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function historyByRegno(req, res) {
  try {
    const data = await HistoryService.historyByRegno(req.params.regno)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function myHistory(req, res) {
  try {
    const data = await HistoryService.myHistory(req.params.regno, req.params.phone)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function deleteHistoryForVehicle(req, res) {
  try {
    await HistoryService.deleteHistoryForVehicle(req.params.regno)
    return res.status(204).send({ message: 'Deleted successfully' })
  } catch (e) {
    return HelperService.onError(e, res)
  }
}
