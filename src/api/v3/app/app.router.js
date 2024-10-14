const express = require('express')
const AuthSchema = require('../../common/schemas/auth.schema')
const AppController = require('./app.controller')
const validator = require('express-joi-validation')({})
const AppSchema = require('./app.schema')
const AuthMiddleware = require('../common/auth.middleware')

const AppRouter = new express.Router()

/**
 * @api {get} v2/app List apps
 * @apiGroup App
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 * {}
 */
AppRouter.get(
  '/',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isAuthenticated,
  AppController.all
)

/**
 * @api {get} v2/app/:id Get by id
 * @apiGroup App
 * @apiParam {String} id
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 * {}
 */
AppRouter.get(
  '/:id',
  AuthMiddleware.isAuthenticated,
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AppController.findOne
)

/**
 * @api {delete} v2/app/:id Delete by id
 * @apiGroup App
 * @apiParam {String} id
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 * {}
 */
AppRouter.delete(
  '/:id',
  AuthMiddleware.isSuperuser,
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AppController.deleteApp
)

/**
 * @api {get} v2/app/:id/consumers Get consumers by id
 * @apiGroup App
 * @apiParam {String} id
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 * {}
 */
AppRouter.get(
  '/:id/consumers',
  AuthMiddleware.isSuperuser,
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AppController.consumers
)

/**
 * @api {patch} v2/app/:id Update app
 * @apiGroup App
 * @apiParam {String} id
 * @apiParam (body) {String} name
 * @apiParam (body) {Boolean} active
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 * {}
 */
AppRouter.patch(
  '/:id',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  validator.body(AppSchema.onPatch, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AuthMiddleware.isAuthenticated,
  AppController.update
)

/**
 * @api {post} v2/app Create app
 * @apiGroup App
 * @apiParam (body) {String} name
 * @apiParam (body) {Boolean} active
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 * {}
 */
AppRouter.post(
  '/',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  validator.body(AppSchema.onCreate, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  AppController.create
)

/**
 * @api {post} v2/app/:id/setting List app settings
 * @apiGroup App
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 * {}
 */
AppRouter.get(
  '/:id/setting',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  AppController.appSettings
)

/**
 * @api {post} v2/app/:id/setting Create app setting
 * @apiGroup App
 * @apiParam (query) {Number} app_id
 * @apiParam (body) {String} key
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 * {}
 */
AppRouter.post(
  '/:id/setting',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  validator.body(AppSchema.onCreateSetting, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  AppController.createAppSetting
)

module.exports = AppRouter
