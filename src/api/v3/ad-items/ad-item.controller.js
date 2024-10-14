const AdItemService = require('./ad-item.service')
const HelperService = require('../../common/helper.service')

const AdItemController = {
  search: search,
  searchDetails,
  adDetails,
  sendOrder,
  orders,
  scanBarcode,
}

module.exports = AdItemController

async function search(req, res) {
  try {
    const data = await AdItemService.searchByWholesale(
      req.params.wholesaleId,
      req.query.term,
      req.query.limit,
      req.query.offset,
      req.query.field
    )
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function searchDetails(req, res) {
  try {
    const data = await AdItemService.searchDetails(req.params)
    return res.status(200).send({ message: data })
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function adDetails(req, res) {
  try {
    const data = await AdItemService.getDetails(
      req.params.articleNumberWithAlpha,
      req.params.customerNumber
    )
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function sendOrder(req, res) {
  try {
    const data = await AdItemService.sendOrder(req.body)
    return res.status(200).send({ message: data })
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function orders(req, res) {
  try {
    const data = await AdItemService.orders(req.params.wholesaleId, req.query.start, req.query.end)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function scanBarcode(req, res) {
  try {
    const data = await AdItemService.scan(req.params.wholesaleId, req.params.barcode)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}
