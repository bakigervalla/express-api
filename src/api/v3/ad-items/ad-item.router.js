const express = require('express')
const AuthSchema = require('../../common/schemas/auth.schema')
const AdItemController = require('./ad-item.controller')
const validator = require('express-joi-validation')({})
const AdItemSchema = require('./ad-item.schema')
const AuthMiddleware = require('../../common/middleware/auth.middleware')

const AdItemRouter = new express.Router()

/**
 * @api {get} v3/wholesale/:wholesaleId/search Ad items search by wholesaler
 * @apiDescription Search for Auto Data items by wholesaler id
 * @apiGroup AdItem
 * @apiParam {String} wholesaleId
 * @apiParam (query) {String} term
 * @apiParam (query) {String=description,articleNumber} field=description
 * @apiParam (query) {Number} [sort]
 * @apiParam (query) {Number} [limit]
 * @apiParam (query) {Number} [offset]
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 * {}
 */
AdItemRouter.get(
  '/:wholesaleId/search',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isAuthenticated,
  validator.query(AdItemSchema.onSearch, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AdItemController.search
)

/**
 * @api {get} v3/wholesale/:wholesaleId/scan/:barcode Ad items search by barcode
 * @apiDescription Search for Auto Data items by barcode
 * @apiGroup AdItem
 * @apiParam {String} wholesaleId
 * @apiParam {String} barcode
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 * {}
 */
AdItemRouter.get(
  '/:wholesaleId/scan/:barcode',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isAuthenticated,
  validator.params(AdItemSchema.onSearchBarcode, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AdItemController.scanBarcode
)

/**
 * @api {get} v3/item/:articleNumberWithAlpha/:customerNumber
 * @apiDescription Get and ad item by article number (with alpha) and customer number (workshop)
 * @apiGroup AdItem
 * @apiParam {String} articleNumberWithAlpha
 * @apiParam {String} customerNumber
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 * {}
 */
AdItemRouter.get(
  '/item/:articleNumberWithAlpha/:customerNumber',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isAuthenticated,
  AdItemController.adDetails
)

/**
 * @api {get} v3/batchsearch/item/:articleNumberWithAlpha/:customerNumber
 * @apiDescription Get and ad item by article number (with alpha) and customer number (workshop)
 * @apiGroup AdItem
 * @apiParam {String} articleNumberWithAlpha
 * @apiParam {String} customerNumber
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 * {}
 */
AdItemRouter.get(
  '/batchsearch/item/:articleNumberWithAlpha/:customerNumber',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isAuthenticated,
  AdItemController.searchDetails
)

/**
 * @api {post} v3/item/send-order
 * @apiDescription Send ad item order
 * @apiGroup AdItem
 * @apiParam {String} wholesaleId
 * @apiParam {Array} rows
 * @apiParam {String} customer_number
 * @apiParam {String} wholesale_number
 * @apiParam {String} app_id The id of the Cars Web Solution app
 * @apiParam {String} [requisition_number]
 * @apiParam {String} [text]
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 * {}
 */
AdItemRouter.post(
  '/:wholesaleId/send-order',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isAuthenticated,
  validator.body(AdItemSchema.onOrder, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AdItemController.sendOrder
)

/**
 * @api {get} v3/item/:wholesaleId/orders
 * @apiDescription Get orders by wholesaler
 * @apiGroup AdItem
 * @apiParam {String} wholesaleId
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 * {}
 */
AdItemRouter.get(
  '/:wholesaleId/orders',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isAuthenticated,
  validator.query(AdItemSchema.onListOrders, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AdItemController.orders
)

module.exports = AdItemRouter
