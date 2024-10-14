const express = require('express')
const validator = require('express-joi-validation')({})
const InfoController = require('./info.controller')
const AuthMiddleware = require('../../common/middleware/auth.middleware')
const authSchema = require('../../common/schemas/auth.schema')
const infoSchema = require('./info.schema')

const InfoRouter = new express.Router()

/**
 * @api {post} v3/info Create a new info object
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer <token>"
 *     }
 *
 * @apiGroup Info
 * @apiParam {String} cuname Customer name
 * @apiParam {String} cumobile Customer mobile phone number
 * @apiParam {String} expires When the Info expires and can no longer be booked
 * @apiParam {String} orderid The Cars order id
 * @apiParam {String} regid Car registration id
 * @apiParam {Array} result Which options the customer can choose from
 * @apiParam {String} sename Company name
 * @apiParam {String} sephone Company phone number
 */
InfoRouter.route('/').post(
  validator.headers(authSchema.header),
  AuthMiddleware.isAuthenticated,
  validator.body(infoSchema.create, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  InfoController.create
)

/**
 * @api {get} v3/info/{:id} Retrieve a single info object
 * @apiGroup Info
 */
InfoRouter.route('/:id').get(InfoController.findOne)

/**
 * @api {patch} v3/info Update info
 * @apiGroup Info
 * @apiParam {Array} order Which options the customer has chosen
 */
InfoRouter.route('/:id').patch(
  validator.body(infoSchema.update, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  InfoController.update
)

module.exports = InfoRouter
