const S3BucketService = require('../../common/s3-bucket.service')
const HelperService = require('../../common/helper.service')
const { S3_BUCKET_NAME } = require('../../../config')

const ImageController = {
  all: all,
  getUploadUrl: getUploadUrl,
  deleteImage: deleteImage,
}

module.exports = ImageController

async function all(req, res) {
  try {
    const data = await S3BucketService.listFiles(S3_BUCKET_NAME, req.query.folder)
    const images = data.filter((data) => {
      return data.Key.includes('png') || data.Key.includes('jpg') || data.Key.includes('jpeg')
    })
    return res.status(200).send(images)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function getUploadUrl(req, res) {
  try {
    const filename = `${req.body.entity_id}/${req.body.filename}`

    const data = await S3BucketService.getUploadUrl(filename, S3_BUCKET_NAME)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function deleteImage(req, res) {
  try {
    await S3BucketService.deleteImage(req.body.url)
    return res.status(204).send()
  } catch (e) {
    return HelperService.onError(e, res)
  }
}
