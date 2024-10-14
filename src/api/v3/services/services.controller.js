const HelperService = require('../../common/helper.service')
const ServicesService = require('./services.service')

const ServicesController = {
  create,
  remove,
  update,
  getServices,
  createCategory,
  removeCategory,
  updateCategory,
  getCategories,
}

module.exports = ServicesController

async function create(req, res) {
  try {
    await ServicesService.create(req.body)
    return res.status(200).send({ message: 'Ok' })
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function remove(req, res) {
  try {
    const data = await ServicesService.remove(req.params.id)
    return res.status(200).send(data)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

async function update(req, res) {
  try {
    const data = await ServicesService.update(req.params.id, req.body)
    return res.status(200).send(data)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

async function getServices(req, res) {
  try {
    const data = await ServicesService.getServices(req.params.id)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

// Categories
async function createCategory(req, res) {
  try {
    await ServicesService.createCategory(req.body, 'categories')
    return res.status(200).send({ message: 'Ok' })
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function removeCategory(req, res) {
  try {
    const data = await ServicesService.removeCategory(req.params.id)
    return res.status(200).send(data)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

async function updateCategory(req, res) {
  try {
    const data = await ServicesService.updateCategory(req.params.id, req.body)
    return res.status(200).send(data)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

async function getCategories(req, res) {
  try {
    const categories = await ServicesService.getCategories(req.params.id)
    return res.status(200).send(categories)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}
