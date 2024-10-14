const express = require('express')
const AuthSchema = require('../../common/schemas/auth.schema')
const ImageController = require('./image.controller')
const validator = require('express-joi-validation')({})
const ImageSchema = require('./image.schema')
const AuthMiddleware = require('../../common/middleware/auth.middleware')

const ImageRouter = new express.Router()

/**
 * @api {get} v3/image List images
 * @apiGroup Image
 */
ImageRouter.get(
  '/',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isAuthenticated,
  ImageController.all
)

/**
 * @api {post} v3/image Upload url
 * @apiGroup Image
 * @apiParam (body) {String} filename
 * @apiParam (body) {String} entity_id
 */
ImageRouter.post(
  '/upload-url',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  validator.body(ImageSchema.onGetUploadUrl, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  ImageController.getUploadUrl
)

/**
 * @api {Delete} v3/image Delete
 * @apiGroup Image
 * @apiParam (body) {String} urk
 */
ImageRouter.delete(
  '/',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isAuthenticated,
  validator.body(ImageSchema.onDelete, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  ImageController.deleteImage
)

module.exports = ImageRouter
