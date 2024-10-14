const express = require('express')
const validator = require('express-joi-validation')({})
const CollectionPageController = require('./collection-page.controller')
const AuthMiddleware = require('../../common/middleware/auth.middleware')
const authSchema = require('../../common/schemas/auth.schema')
const CollectionPageSchema = require('./collection-page.schema')

const CollectionPageRouter = new express.Router()

/**
 * @api {get} v3/collection-page List collection pages
 * @apiGroup CollectionPage
 */
CollectionPageRouter.route('/').get(
  validator.query(CollectionPageSchema.list, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  CollectionPageController.list
)

/**
 * @api {get} v3/collection-page List collection pages hierarchy
 * @apiGroup CollectionPage
 */
CollectionPageRouter.route('/hierarchy').get(CollectionPageController.hierarchy)

/**
 * @api {post} v3/collection-page Create a new collection page
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer <token>"
 *     }
 *
 * @apiGroup CollectionPage
 * @apiParam {String} name Page name
 * @apiParam {String} type Page type
 */
CollectionPageRouter.route('/').post(
  validator.headers(authSchema.header),
  AuthMiddleware.isAuthenticated,
  validator.body(CollectionPageSchema.create, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  CollectionPageController.create
)

/**
 * @api {get} v3/collection-page/:id Get a single collection page
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer <token>"
 *     }
 *
 * @apiGroup CollectionPage
 * @apiParam {String} id Page id
 */
CollectionPageRouter.route('/:id').get(
  validator.headers(authSchema.header),
  AuthMiddleware.isAuthenticated,
  CollectionPageController.findOne
)

/**
 * @api {patch} v3/collection-page/:id Updates a collection page
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer <token>"
 *     }
 *
 * @apiGroup CollectionPage
 * @apiParam {String} id Page id
 * @apiParam (body) {Number} parent_id Id of parent page
 */
CollectionPageRouter.route('/:id').patch(
  validator.headers(authSchema.header),
  AuthMiddleware.isAuthenticated,
  validator.body(CollectionPageSchema.create, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  CollectionPageController.updatePage
)

/**
 * @api {delete} v3/collection-page/:id Deletes a collection page
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer <token>"
 *     }
 *
 * @apiGroup CollectionPage
 * @apiParam {String} id Page id
 */
CollectionPageRouter.route('/:id').delete(
  validator.headers(authSchema.header),
  AuthMiddleware.isAuthenticated,
  CollectionPageController.removePage
)

/**
 * @api {delete} v3/collection-page/:id/parent Removes collection page parent
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer <token>"
 *     }
 *
 * @apiGroup CollectionPage
 * @apiParam {String} id Page id
 */
CollectionPageRouter.route('/:id/parent').delete(
  validator.headers(authSchema.header),
  AuthMiddleware.isAuthenticated,
  CollectionPageController.removeParent
)

/**
 * @api {get} v3/collection-page/:id/workshop Get workshop to a collection page
 * @apiGroup CollectionPage
 * @apiParam {String} workshop_id Workshop id
 */
CollectionPageRouter.route('/:id/workshop').get(CollectionPageController.listWorkshops)

/**
 * @api {post} v3/collection-page/:id/workshop Add workshop to a collection page
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer <token>"
 *     }
 *
 * @apiGroup CollectionPage
 * @apiParam {String} workshop_id Workshop id
 */
CollectionPageRouter.route('/:id/workshop').post(
  validator.headers(authSchema.header),
  AuthMiddleware.isAuthenticated,
  validator.body(CollectionPageSchema.addWorkshop, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  CollectionPageController.addWorkshop
)

/**
 * @api {delete} v3/collection-page/:id/workshop Remove workshop from a collection page
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer <token>"
 *     }
 *
 * @apiGroup CollectionPage
 * @apiParam {String} workshop_id Workshop id
 */
CollectionPageRouter.route('/:id/workshop').delete(
  validator.headers(authSchema.header),
  AuthMiddleware.isAuthenticated,
  validator.body(CollectionPageSchema.addWorkshop, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  CollectionPageController.removeWorkshop
)

module.exports = CollectionPageRouter
