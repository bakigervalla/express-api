const express = require('express')
const validator = require('express-joi-validation')({})
const NoticeController = require('./notice.controller')
const AuthMiddleware = require('../../common/middleware/auth.middleware')
const authSchema = require('../../common/schemas/auth.schema')
const noticeSchema = require('./notice.schema')

const NoticeRouter = new express.Router()

/**
 * @api {post} v3/notice Create a new notice object
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiGroup Notice
 * @apiParam {String} regid The car registration id
 * @apiParam {String} sename The company name
 * @apiParam {String} sephone The company phone number
 * @apiParam {String} cuname The customer name
 * @apiParam {String} cumobile The customer phone number
 * @apiParam {String} pictureid The id of the picture to be displayed in the app
 * @apiParam {String} text The notice text
 */
NoticeRouter.route('/').post(
  validator.headers(authSchema.header),
  AuthMiddleware.isAuthenticated,
  validator.body(noticeSchema.create),
  NoticeController.create
)

/**
 * @api {get} v3/notice/query Search for notices between dates
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiGroup Notice
 * @apiParam {String} start_date Start date (yyyy-mm-dd)
 * @apiParam {String} end_date End date (yyyy-mm-dd)
 * @apiParam {Boolean} [is_sold] If the cars returned should be marked as sold or not
 *
 * @apiSuccess {String} id The id of the created object
 *
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 */
NoticeRouter.route('/query').get(
  validator.headers(authSchema.header),
  AuthMiddleware.isAuthenticated,
  validator.query(noticeSchema.query),
  NoticeController.query
)

/**
 * @api {get} v3/notice/:id
 * @apiName QueryNotice
 * @apiGroup Notice
 * @apiParam {String} id
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 */
NoticeRouter.route('/:id').get(NoticeController.findOne)

/**
 * @api {patch} v3/notice/:id
 * @apiName QueryNotice
 * @apiGroup Notice
 * @apiParam {String} id
 * @apiParam (body) {Boolean} is_sold
 * @apiParam (body) {String} [new_reg_id]
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 */
NoticeRouter.route('/:id').patch(validator.body(noticeSchema.update), NoticeController.update)

module.exports = NoticeRouter
