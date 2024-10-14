const InfoService = require('./info.service')
const ResponseHandlers = require('../common/response-handlers')

/**
 * @export InfoController
 * @type {{findOne: findOne, create: create, update: update}}
 */
const InfoController = {
  findOne: findOne,
  create: create,
  update: update,
}

module.exports = InfoController

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function findOne(req, res) {
  try {
    const data = await InfoService.findOne(req.params.id)
    return ResponseHandlers.returnData(res, data)
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function create(req, res) {
  try {
    const data = await InfoService.create(req.body)
    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function update(req, res) {
  try {
    const data = await InfoService.update(req.params.id, req.body)
    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}
