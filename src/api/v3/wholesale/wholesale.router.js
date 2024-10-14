const express = require('express')
const AuthSchema = require('../../common/schemas/auth.schema')
const WholesaleSchema = require('./wholesale.schema')
const WholesaleController = require('./wholesale.controller')
const validator = require('express-joi-validation')({})
const AuthMiddleware = require('../common/auth.middleware')

const WholesaleRouter = new express.Router()

/**
 * @api {get} v3/wholesale List
 * @apiGroup Wholesale
 */
WholesaleRouter.get('/', WholesaleController.all)

/**
 * @api {get} v3/wholesale Get wholesaler by id
 * @apiGroup Wholesale
 * @apiParam {String} id
 */
WholesaleRouter.get(
  '/:id',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  WholesaleController.findOne
)

/**
 * @api {get} v3/wholesale/:id/workshops Get wholesaler workshops
 * @apiGroup Wholesale
 * @apiParam {String} id
 */
WholesaleRouter.get(
  '/:id/workshops',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  WholesaleController.workshops
)

/**
 * @api {patch} v3/wholesale Update
 * @apiGroup Wholesale
 * @apiParam {String} id
 * @apiParam (body) {String} [name]
 * @apiParam (body) {Number} [wholesale_number]
 * @apiParam (body) {Boolean} [active]
 */
WholesaleRouter.patch(
  '/:id',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  validator.body(WholesaleSchema.onUpdate, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  WholesaleController.update
)

/**
 * @api {post} v3/wholesale Create
 * @apiGroup Wholesale
 * @apiParam (body) {String} name
 * @apiParam (body) {Number} [wholesale_number]
 * @apiParam (body) {Boolean} [active]
 */
WholesaleRouter.post(
  '/',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  validator.body(WholesaleSchema.onCreate, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  WholesaleController.create
)

/**
 * @api {get} v3/wholesale/:id/ad-items
 * @apiDescription Get Auto Data items by wholesaler id
 * @apiParam {String} wholesaleId
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 * {}
 */
WholesaleRouter.get(
  '/:id/ad-items',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  WholesaleController.adItems
)

/**
 * @api {patch} v3/wholesale/:id/ad-items
 * @apiDescription Trigger Auto Data ftp download and update database items
 * @apiGroup Wholesale
 * @apiParam {String} id
 */
WholesaleRouter.patch(
  '/:id/ad-items',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  WholesaleController.updateItems
)

/**
 * @api {delete} v3/wholesale/:id/ad-items
 * @apiDescription Delete all ad items
 * @apiGroup Wholesale
 * @apiParam {String} id
 */
WholesaleRouter.delete(
  '/:id/ad-items',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  WholesaleController.deleteAdItems
)

/**
 * @api {post} v3/wholesale/customer-auth
 * @apiDescription Customer authentication for apps
 * @apiGroup Wholesale
 * @apiParam (body) {Number} workshop_number
 * @apiParam (body) {Number} customer_number
 * @apiParam (body) {String} app_id
 */
WholesaleRouter.post(
  '/customer-auth',
  validator.body(WholesaleSchema.onCustomerAuth, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  WholesaleController.customerAuth
)

/**
 * @api {post} v3/wholesale/:id/app
 * @apiDescription List apps by wholesaler
 * @apiGroup Wholesale
 * @apiParam {String} id
 * @apiParam (body) {String} wholesaler_id
 */
WholesaleRouter.get('/:id/app', AuthMiddleware.isSuperuser, WholesaleController.apps)

/**
 * @api {post} v3/wholesale/:id/app
 * @apiDescription Add app to wholesaler
 * @apiGroup Wholesale
 * @apiParam {String} id
 * @apiParam (body) {String} app_id
 */
WholesaleRouter.post(
  '/:id/app',
  validator.body(WholesaleSchema.onAddApp, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  WholesaleController.addApp
)

/**
 * @api {post} v3/wholesale/:id/app
 * @apiDescription Add app to wholesaler
 * @apiGroup Wholesale
 * @apiParam {String} id
 * @apiParam {String} app_id
 */
WholesaleRouter.delete('/:id/app/:appId', AuthMiddleware.isSuperuser, WholesaleController.removeApp)

/**
 * @api {post} v3/wholesale/:id/tire-upload-url
 * @apiDescription Get tire S3 upload url
 * @apiGroup Wholesale
 * @apiParam {String} id
 */
WholesaleRouter.post(
  '/:id/tire-upload-url',
  AuthMiddleware.isSuperuser,
  WholesaleController.getTireFileUploadUrl
)

/**
 * @api {get} v3/wholesale/:id/tires
 * @apiDescription Get tire files
 * @apiGroup Wholesale
 * @apiParam {String} id
 */
WholesaleRouter.get(
  '/:id/tires',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  WholesaleController.getTireFile
)

/**
 * @api {patch} v3/wholesale/:id/tires
 * @apiDescription Trigger tire file update
 * @apiGroup Wholesale
 * @apiParam {String} id
 */
WholesaleRouter.patch(
  '/:id/tires',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  validator.body(WholesaleSchema.onTireUpdate, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  WholesaleController.updateTires
)

module.exports = WholesaleRouter
