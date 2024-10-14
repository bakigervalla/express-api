const express = require('express')
const validator = require('express-joi-validation')({})
const WorkshopController = require('./workshop.controller')
const WorkshopSchema = require('./workshop.schema')
const AuthMiddleware = require('../common/auth.middleware')
const authSchema = require('../../common/schemas/auth.schema')

const WorkshopRouter = new express.Router()

/**
 * @api {get} v3/workshop List workshops
 * @apiGroup Workshop
 */
WorkshopRouter.route('/').get(validator.query(WorkshopSchema.query), WorkshopController.all)

/**
 * @api {get} v3/workshop/search Search for workshop
 * @apiGroup Workshop
 * @apiParam (query) {String} term
 */
WorkshopRouter.route('/search').get(
  validator.query(WorkshopSchema.search),
  WorkshopController.search
)

/**
 * @api {get} v3/workshop List workshops
 * @apiGroup Workshop
 */
WorkshopRouter.route('/images').get(WorkshopController.images)

/**
 * @api {get} v3/workshop/:id List workshops
 * @apiGroup Workshop
 */
WorkshopRouter.route('/:id').get(
  validator.headers(authSchema.header),
  AuthMiddleware.isAuthenticated,
  WorkshopController.byId
)

/**
 * @api {post} v3/workshop Create workshop
 * @apiGroup Workshop
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiParam {String} dist Dist code
 * @apiParam {String} name Name
 * @apiParam {String} slug Slug
 * @apiParam {String} street Street
 * @apiParam {String} zip Zip
 * @apiParam {String} city City
 * @apiParam {String} county County
 * @apiParam {Number} lat Latitude
 * @apiParam {Number} long Longitude
 * @apiParam {String} email E-mail
 * @apiParam {String} phone Phone
 * @apiParam {Boolean} active Whether the workshop is active
 * @apiParam {Number} customer_number The wholesaler customer number
 * @apiParam {Number} workshop_number The workshop number
 * @apiParam {String} facebook URL to Facebook page
 * @apiParam {String} homepage URL to homepage
 * @apiParam {String} free_text Free text (html)
 */
WorkshopRouter.post(
  '/',
  validator.headers(authSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  validator.body(WorkshopSchema.onCreate, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AuthMiddleware.isAuthenticated,
  WorkshopController.create
)

/**
 * @api {patch} v3/workshop Update workshop
 * @apiGroup Workshop
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiParam {String} dist Dist code
 * @apiParam {String} name Name
 * @apiParam {String} slug Slug
 * @apiParam {String} street Street
 * @apiParam {String} zip Zip
 * @apiParam {String} city City
 * @apiParam {String} county County
 * @apiParam {Number} lat Latitude
 * @apiParam {Number} long Longitude
 * @apiParam {String} email E-mail
 * @apiParam {String} phone Phone
 * @apiParam {Boolean} active Whether the workshop is active
 * @apiParam {Number} customer_number The wholesaler customer number
 * @apiParam {Number} workshop_number The workshop number
 * @apiParam {String} facebook URL to Facebook page
 * @apiParam {String} homepage URL to homepage
 * @apiParam {String} free_text Free text (html)
 * @apiParam {String} opening_hours
 */
WorkshopRouter.patch(
  '/:id',
  validator.headers(authSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  validator.body(WorkshopSchema.onPatch, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AuthMiddleware.isAuthenticated,
  WorkshopController.update
)

/**
 * @api {delete} v3/workshop Delete a workshop
 * @apiGroup Workshop
 * @apiHeader (Headers) {String} authorization Authorization token
 */
WorkshopRouter.delete(
  '/:id',
  validator.headers(authSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  WorkshopController.remove
)

/**
 * @api {post} v3/workshop/:id Get workshop images
 * @apiGroup Workshop
 */
WorkshopRouter.get('/:id/images', WorkshopController.imagesByWorkshop)

/**
 * @api {post} v3/workshop/:id/images Add workshop image
 * @apiGroup Workshop
 */
WorkshopRouter.post(
  '/:id/images',
  validator.body(WorkshopSchema.onImage, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  WorkshopController.addImageToWorkshop
)

/**
 * @api {delete} v3/workshop/:id/images/:imageId Delete workshop image
 * @apiGroup Workshop
 */
WorkshopRouter.delete('/:id/images/:imageId', WorkshopController.deleteImageFromWorkshop)

/**
 * @api {get} v3/workshop/:id/meta Get SEO meta
 * @apiGroup Workshop
 */
WorkshopRouter.get('/:id/meta', WorkshopController.getMeta)

/**
 * @api {patch} v3/workshop/:id/meta Add SEO meta
 * @apiGroup Workshop
 */
WorkshopRouter.patch(
  '/:id/meta',
  validator.headers(authSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  validator.body(WorkshopSchema.onMeta, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  WorkshopController.updateMeta
)

/**
 * @api {get} v3/workshop/:id/app List workshop apps
 * @apiGroup Workshop
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiParam {String} id Workshop id
 */
WorkshopRouter.get('/:id/app', AuthMiddleware.isSuperuser, WorkshopController.listApp)

/**
 * @api {post} v3/workshop/:id/app Add workshop app
 * @apiGroup Workshop
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiParam (query) {String} id Workshop id
 * @apiParam {String} app_id The id of the app
 */
WorkshopRouter.post(
  '/:id/app',
  validator.body(WorkshopSchema.onAddApp, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  WorkshopController.addApp
)

/**
 * @api {get} v3/workshop/:id/app/:appId/setting List workshop app setting
 * @apiGroup Workshop
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiParam {String} id Workshop id
 */
WorkshopRouter.get(
  '/:id/app/setting',
  validator.headers(authSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  WorkshopController.listAppSettings
)

/**
 * @api {post} v3/workshop/:id/app/setting Create workshop app setting
 * @apiGroup Workshop
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiParam (query) {String} id Workshop id
 * @apiParam (body) {String} app_setting_id App setting id
 * @apiParam (body) {String} value The setting value
 */
WorkshopRouter.patch(
  '/:id/app/setting',
  validator.headers(authSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  validator.body(WorkshopSchema.onUpdateAppSetting, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  WorkshopController.updateAppSetting
)

/**
 * @api {delete} v3/workshop/:id/app/:appId Add workshop app
 * @apiGroup Workshop
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiParam (query) {String} id Workshop id
 * @apiParam (query) {String} app_id The id of the app
 */
WorkshopRouter.delete(
  '/:id/app/:appId',
  validator.headers(authSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  WorkshopController.removeApp
)

/**
 * @api {get} v3/workshop/:slug Get workshop by slug
 * @apiGroup Workshop
 * @apiParam (query) {String} slug
 */
WorkshopRouter.route('/slug/:slug').get(
  validator.query(WorkshopSchema.slug),
  WorkshopController.bySlug
)

/**
 * @api {get} v3/workshop/:id/collection-page Get workshop collection pages
 * @apiGroup Workshop
 * @apiParam (query) {String} id
 */
WorkshopRouter.route('/:id/collection-page').get(WorkshopController.listCollectionPages)

/**
 * @api {get} v3/workshop/:id/history List workshop history
 * @apiGroup Workshop
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiParam (query) {String} dist Workshop dist code
 */
WorkshopRouter.get(
  '/:dist/history',
  validator.headers(authSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  WorkshopController.listHistoryByDist
)

/**
 * @api {delete} v3/workshop/:id/history List workshop history
 * @apiGroup Workshop
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiParam (query) {String} dist Workshop dist code
 */
WorkshopRouter.delete(
  '/:dist/history',
  validator.headers(authSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  WorkshopController.deleteHistoryByDist
)

module.exports = WorkshopRouter
