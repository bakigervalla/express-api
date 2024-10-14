const express = require('express')
const validator = require('express-joi-validation')({})
const WebOrderController = require('./web-order.controller')
const webOrderSchema = require('./web-order.schema')
const AuthSchema = require('../../common/schemas/auth.schema')
const AuthMiddleware = require('../common/auth.middleware')

const WebOrderRouter = new express.Router()

WebOrderRouter.route('/').post(
  validator.body(webOrderSchema.create, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  WebOrderController.create
)

WebOrderRouter.route('/').get(
  validator.headers(AuthSchema.header),
  AuthMiddleware.isAuthenticated,
  validator.query(webOrderSchema.onAll, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  WebOrderController.find
)

WebOrderRouter.route('/:dist').get(
  validator.headers(AuthSchema.header),
  AuthMiddleware.isAuthenticated,
  validator.query(webOrderSchema.onFetch, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  WebOrderController.findByDist
)

module.exports = WebOrderRouter
