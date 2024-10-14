const HelperService = require('../../common/helper.service')
const WebOrderService = require('./web-order.service')

const WebOrderController = {
  create,
  findByDist,
  find,
}

module.exports = WebOrderController

async function create(req, res) {
  try {
    const shouldSendEmail = await WebOrderService.hasEmailSetting(req.body.workshop_id)

    if (shouldSendEmail) {
      await WebOrderService.create(req.body, 'email')
      await WebOrderService.sendEmail(req.body, req.body.workshop_id)
    } else {
      await WebOrderService.create(req.body, 'cars')
    }

    return res.status(200).send({ message: 'Ok' })
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function findByDist(req, res) {
  try {
    const orders = await WebOrderService.findByDist(
      req.params.dist,
      req.query.fetched,
      req.query.startAt
    )
    return res.status(200).send(orders)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function find(req, res) {
  try {
    const orders = await WebOrderService.find(req.query.startAt, req.query.endAt)
    return res.status(200).send(orders)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}
