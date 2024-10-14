const QuoteService = require('./quote.service')
const ResponseHandlers = require('../common/response-handlers')

/**
 * @exports QuoteController
 * @type {{create: create, findOne: findOne, update: update}}
 */
const QuoteController = {
  create: create,
  findOne: findOne,
  update: update,
}

module.exports = QuoteController

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function create(req, res) {
  try {
    const data = await QuoteService.create(req.body)
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
async function findOne(req, res) {
  try {
    const data = await QuoteService.findOne(req.params.id)
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
async function update(req, res) {
  try {
    const data = await QuoteService.update(req.params.id, req.body)
    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}
