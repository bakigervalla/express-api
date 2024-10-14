const CollectionPageService = require('./collection-page.service')

/**
 * @export CollectionPageController
 * @type {{create: create, removeParent: removeParent}}
 */
const CollectionPageController = {
  list,
  hierarchy,
  create,
  updatePage,
  removePage,
  listWorkshops,
  addWorkshop,
  removeWorkshop,
  findOne,
  removeParent,
}

module.exports = CollectionPageController

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function list(req, res) {
  try {
    const data = await CollectionPageService.list(req.query.withWorkshops)
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
async function hierarchy(req, res) {
  try {
    const data = await CollectionPageService.hierarchy()
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
async function create(req, res) {
  try {
    const data = await CollectionPageService.create(
      req.body.name,
      req.body.parent_id,
      req.body.hidden
    )
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
async function updatePage(req, res) {
  try {
    const data = await CollectionPageService.updatePage(
      req.params.id,
      req.body.name,
      req.body.parent_id,
      req.body.hidden
    )
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
async function removePage(req, res) {
  try {
    const data = await CollectionPageService.removePage(req.params.id)
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
async function listWorkshops(req, res) {
  try {
    const data = await CollectionPageService.listWorkshops(req.params.id)
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
async function addWorkshop(req, res) {
  try {
    const data = await CollectionPageService.addWorkshop(req.params.id, req.body.workshop_id)
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
async function removeWorkshop(req, res) {
  try {
    const data = await CollectionPageService.removeWorkshop(req.params.id, req.body.workshop_id)
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
    const data = await CollectionPageService.findOne(req.params.id)
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
async function removeParent(req, res) {
  try {
    const data = await CollectionPageService.removeParent(req.params.id)
    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}
