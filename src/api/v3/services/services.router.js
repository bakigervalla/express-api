const express = require('express')
const validator = require('express-joi-validation')({})
const ServicesController = require('./services.controller')
const ServicesSchema = require('./services.schema')
const AuthSchema = require('../../common/schemas/auth.schema')
const AuthMiddleware = require('../common/auth.middleware')

const ServicesRouter = new express.Router()

ServicesRouter.post(
  '/',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  validator.body(ServicesSchema.onCreateService, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AuthMiddleware.isAuthenticated,
  ServicesController.create
)

/**
 * @api {delete} v3/services/:id/
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiParam (query) {String} Service id
 */
ServicesRouter.delete(
  '/:id',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  ServicesController.remove
)

/**
 * @api {patch} v3/services Update
 * @apiGroup Services
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiParam {String} name
 * @apiParam {String} description
 * @apiParam {String} is_active
 */
ServicesRouter.patch(
  '/:id',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  validator.body(ServicesSchema.onUpdateService, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AuthMiddleware.isAuthenticated,
  ServicesController.update
)

ServicesRouter.route('/:id').get(ServicesController.getServices)

// Categories
ServicesRouter.post(
  '/categories',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  validator.body(ServicesSchema.onCreateCategory, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AuthMiddleware.isAuthenticated,
  ServicesController.createCategory
)

/**
 * @api {delete} v3/services/:id/
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiParam (query) {String} Service id
 */
ServicesRouter.delete(
  '/categories/:id',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  ServicesController.removeCategory
)

/**
 * @api {patch} v3/services Update
 * @apiGroup Services
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiParam {String} name
 * @apiParam {String} description
 * @apiParam {String} is_active
 */
ServicesRouter.patch(
  '/categories/:id',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  validator.body(ServicesSchema.onUpdateCategory, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AuthMiddleware.isAuthenticated,
  ServicesController.updateCategory
)

ServicesRouter.route('/categories/:id').get(
  validator.headers(AuthSchema.header),
  AuthMiddleware.isAuthenticated,
  ServicesController.getCategories
)

module.exports = ServicesRouter
