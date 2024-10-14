const CONFIG = require('../../config')
const AWS = require('aws-sdk')
const moment = require('moment')
const axios = require('axios')

/**
 * @exports S3BucketService
 * @description This file contains functions for handling images in AWS S3 bucket.
 */
const S3BucketService = {
  listFiles,
  getUploadUrl,
  deleteImage,
  getPreSignedPutUrl,
}

module.exports = S3BucketService

const s3 = new AWS.S3({
  accessKeyId: CONFIG.AWS_ACCESS_KEY_ID,
  secretAccessKey: CONFIG.AWS_SECRET_ACCESS_KEY,
  region: CONFIG.S3_REGION,
})

function listFiles(Bucket, sourceId = null) {
  return new Promise((resolve, reject) => {
    let options = { Bucket }

    if (sourceId) {
      options = Object.assign({}, options, { Prefix: `${sourceId}/` })
    }

    s3.listObjects(options, (error, data) => {
      if (error) {
        return reject(error)
      }

      return resolve(data.Contents)
    })
  })
}

/**
 * @param {string} key
 * @param {string} bucket
 * @return {Promise<*>}
 */
async function getUploadUrl(key, bucket) {
  try {
    // Replace æøå in filename
    key = key.replace('æ', 'ae')
    key = key.replace('ø', 'o')
    key = key.replace('å', 'aa')

    const parts = key.split('.')
    key = `${parts[0]}_${moment().valueOf()}.${parts[1]}`

    const url = await getPreSignedPutUrl(key, bucket, parts[1])
    return { filename: key, url }
  } catch (e) {
    throw e
  }
}

/**
 * @param {string} key
 * @param {string} bucket
 * @param {string} contentType
 * @return {Promise<*>}
 * @private
 */
function getPreSignedPutUrl(key, bucket, contentType) {
  return new Promise((resolve, reject) => {
    s3.getSignedUrl(
      'putObject',
      {
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
      },
      (error, url) => {
        if (error) {
          return reject(error)
        }

        return resolve(url)
      }
    )
  })
}

async function deleteImage(imageUrl) {
  try {
    const parts = imageUrl.split('/')
    const sourceId = parts[parts.length - 2]
    const filename = parts[parts.length - 1]

    const url = await getPreSignedDeleteUrl(sourceId, filename)
    await axios.delete(url)
  } catch (e) {
    throw e
  }
}

/**
 * @param {string} sourceId
 * @param {string} filename
 * @return {Promise<*>}
 * @private
 */
function getPreSignedDeleteUrl(sourceId, filename) {
  return new Promise((resolve, reject) => {
    s3.getSignedUrl(
      'deleteObject',
      {
        Bucket: CONFIG.S3_BUCKET_NAME,
        Key: `${sourceId}/${filename}`,
      },
      (error, url) => {
        if (error) {
          return reject(error)
        }

        return resolve(url)
      }
    )
  })
}
