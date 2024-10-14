const WorkshopService = require('./workshop.service')
const ApiHelper = require('../../api-helper')

/**
 * @type {{all: all, search: search, bySlug: bySlug, byId: byId, addApp: addApp, removeApp: removeApp, update: update,
 * create: create, collectionPage: collectionPage, listHistoryByDist: listHistoryByDist, deleteHistoryByDist: deleteHistoryByDist}}
 */
const WorkshopController = {
  all,
  search,
  bySlug,
  byId,
  images,
  addImageToWorkshop,
  deleteImageFromWorkshop,
  imagesByWorkshop,
  listApp,
  addApp,
  removeApp,
  update,
  create,
  remove,
  getMeta,
  updateMeta,
  listAppSettings,
  updateAppSetting,
  listCollectionPages,
  listHistoryByDist,
  deleteHistoryByDist,
}

module.exports = WorkshopController

/**
 * @param {object} req
 * @param {object} res
 * @returns {Promise<*>}
 */
async function all(req, res) {
  try {
    const results = await WorkshopService.all(req.query)
    return res.status(200).send(results)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function search(req, res) {
  try {
    const results = await WorkshopService.search(req.query.term, req.query.appId)
    return res.status(200).send(results)
  } catch (e) {
    console.log(e)
    return res.status(400).send('Error')
  }
}

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function bySlug(req, res) {
  try {
    const workshop = await WorkshopService.findBySlug(req.params.slug)
    return res.status(200).send(workshop)
  } catch (e) {
    console.log(e)
    return res.status(400).send('Error')
  }
}

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function byId(req, res) {
  try {
    const result = await WorkshopService.findOne(req.params.id)
    return res.status(200).send(result)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function images(req, res) {
  try {
    const result = await WorkshopService.images()
    return res.status(200).send(result)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function addImageToWorkshop(req, res) {
  try {
    await WorkshopService.addImage(req.params.id, req.body.image_url)
    return res.status(200).send('Ok')
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function deleteImageFromWorkshop(req, res) {
  try {
    await WorkshopService.deleteImage(req.params.id, req.params.imageId)
    return res.status(200).send('Ok')
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function imagesByWorkshop(req, res) {
  try {
    const data = await WorkshopService.imagesByWorkshop(req.params.id)
    return res.status(200).send(data)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function listApp(req, res) {
  try {
    const data = await WorkshopService.listApp(req.params.id)
    return res.status(200).send(data)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function addApp(req, res) {
  try {
    const data = await WorkshopService.addApp(req.params.id, req.body.app_id)
    return res.status(200).send(data)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function removeApp(req, res) {
  try {
    const data = await WorkshopService.removeApp(req.params.id, req.params.appId)
    return res.status(200).send(data)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

async function update(req, res) {
  try {
    const data = await WorkshopService.update(req.params.id, req.body)
    return res.status(200).send(data)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

async function create(req, res) {
  try {
    const workshop = await WorkshopService.create(req.body)
    return res.status(200).send(workshop)
  } catch (e) {
    console.log(e)
    return ApiHelper.returnError(res, e)
  }
}

async function remove(req, res) {
  try {
    await WorkshopService.remove(req.params.id)
    return res.status(204).send()
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

async function getMeta(req, res) {
  try {
    const meta = await WorkshopService.getMeta(req.params.id)
    return res.status(200).send(meta)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

async function updateMeta(req, res) {
  try {
    const meta = await WorkshopService.updateMeta(req.params.id, req.body)
    return res.status(200).send(meta)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

async function listAppSettings(req, res) {
  try {
    const data = await WorkshopService.listAppSettings(req.params.id)
    return res.status(200).send(data)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

async function updateAppSetting(req, res) {
  try {
    const data = await WorkshopService.updateAppSetting(
      req.params.id,
      req.body.app_setting_id,
      req.body.value
    )
    return res.status(200).send(data)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

async function listCollectionPages(req, res) {
  try {
    const data = await WorkshopService.listCollectionPages(req.params.id)
    return res.status(200).send(data)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

async function listHistoryByDist(req, res) {
  try {
    const data = await WorkshopService.listHistoryByDist(req.params.dist)
    return res.status(200).send(data)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

async function deleteHistoryByDist(req, res) {
  try {
    const data = await WorkshopService.deleteHistoryByDist(req.params.dist)
    return res.status(200).send(data)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}
