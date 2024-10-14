const NoticeService = require('./notice.service')
const ResponseHandlers = require('../common/response-handlers')

/**
 * @export NoticeController
 * @type {{create: create, query: query, update: update}}
 */
const NoticeController = {
  create: create,
  query: query,
  findOne,
  update: update,
}

module.exports = NoticeController

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function create(req, res) {
  try {
    const data = await NoticeService.create(req.body)
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
async function query(req, res) {
  try {
    const data = await NoticeService.query(
      req.query.start_date,
      req.query.end_date,
      req.query.is_sold
    )
    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred' })
  }
}

async function findOne(req, res) {
  try {
    const data = await NoticeService.findOne(req.params.id)
    return ResponseHandlers.returnData(res, data)
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred' })
  }
}

async function update(req, res) {
  try {
    const data = await NoticeService.update(req.params.id, req.body)
    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred' })
  }
}
