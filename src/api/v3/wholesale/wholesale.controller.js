const WholesaleService = require('./wholesale.service')
const HelperService = require('../../common/helper.service')
const S3BucketService = require('../../common/s3-bucket.service')
const { TIRES_BUCKET_NAME } = require('../../../config')

const WholesaleController = {
  all,
  create,
  findOne,
  workshops,
  apps,
  update,
  updateItems,
  customerAuth: customerAuth,
  addApp,
  removeApp: removeApp,
  adItems,
  deleteAdItems,
  getTireFileUploadUrl,
  updateTires,
  getTireFile,
}

module.exports = WholesaleController

async function all(req, res) {
  try {
    const data = await WholesaleService.all()
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function create(req, res) {
  try {
    const data = await WholesaleService.create(req.body)
    return res.status(200).send(data)
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).send({ message: 'Wholesale already exists' })
    }

    return HelperService.onError(e, res)
  }
}

async function findOne(req, res) {
  try {
    const data = await WholesaleService.findOne(req.params.id)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function workshops(req, res) {
  try {
    const data = await WholesaleService.workshops(req.params.id)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function apps(req, res) {
  try {
    const data = await WholesaleService.apps(req.params.id)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function update(req, res) {
  try {
    const data = await WholesaleService.update(req.params.id, req.body)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function updateItems(req, res) {
  try {
    await WholesaleService.triggerADItemsUpdate(req.params.id)
    return res.status(200).send({ message: 'Oppdatering initialisert' })
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function customerAuth(req, res) {
  try {
    const token = await WholesaleService.customerAuth(
      req.body.workshop_number,
      req.body.customer_number,
      req.body.app_id
    )
    return res.status(200).send({ token: token })
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function addApp(req, res) {
  try {
    const data = await WholesaleService.addApp(req.params.id, req.body.app_id)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function removeApp(req, res) {
  try {
    const data = await WholesaleService.removeApp(req.params.id, req.params.appId)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function adItems(req, res) {
  try {
    const data = await WholesaleService.adItems(req.params.id)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function deleteAdItems(req, res) {
  try {
    const data = await WholesaleService.deleteAdItems(req.params.id)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function getTireFileUploadUrl(req, res) {
  try {
    const data = await WholesaleService.getTireFileUploadUrl(req.params.id)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function updateTires(req, res) {
  try {
    const data = await WholesaleService.updateTires(
      req.params.id,
      req.body.article_groups,
      req.body.left_over_stock_groups
    )
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function getTireFile(req, res) {
  try {
    const id = req.params.id
    const wholesaler = await WholesaleService.findOne(id)
    const data = await S3BucketService.listFiles(TIRES_BUCKET_NAME)

    const files = data.filter((file) => file.Key.includes(wholesaler.wholesale_number))

    return res.status(200).send(files)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}
