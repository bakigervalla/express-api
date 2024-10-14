const express = require('express')
const validator = require('express-joi-validation')({})
const ConsentController = require('./consent.controller')
const AuthMiddleware = require('../../common/middleware/auth.middleware')
const authSchema = require('../../common/schemas/auth.schema')
const consentSchema = require('./consent.schema')

const ConsentRouter = new express.Router()

/**
 * @api {post} v3/consent Create consent
 * @apiGroup Consent
 * @apiParam (body) {String} dist
 * @apiParam (body) {String} cuno
 * @apiParam (body) {String} cuname
 * @apiParam (body) {String} cumobile
 * @apiParam (body) {String} [cuaddress]
 * @apiParam (body) {String} sename
 * @apiParam (body) {String} sephone
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 * {}
 */
ConsentRouter.route('/').post(
  validator.headers(authSchema.header),
  AuthMiddleware.isAuthenticated,
  validator.body(consentSchema.create, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  ConsentController.add
)

/**
 * @api {get} v3/consent/:id Get by id
 * @apiGroup Consent
 * @apiParam {String} id
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 * {}
 */
ConsentRouter.route('/:id').get(ConsentController.get)

/**
 * @api {patch} v3/consent/:id Update consent
 * @apiGroup Consent
 * @apiParam (body) {Date} [created]
 * @apiParam (body) {String} [cumobile]
 * @apiParam (body) {String} [cuname]
 * @apiParam (body) {String} [cuno]
 * @apiParam (body) {String} [dist]
 * @apiParam (body) {Boolean} [fetched]
 * @apiParam (body) {String} [sename]
 * @apiParam (body) {String} [sephone]
 * @apiParam (body) {String} [fb_key]
 * @apiParam (body) {Boolean} market_info_sms
 * @apiParam (body) {Boolean} market_info_mail
 * @apiParam (body) {Boolean} reminder_sms
 * @apiParam (body) {Boolean} reminder_mail
 * @apiParam (body) {Boolean} service_sms
 * @apiParam (body) {Boolean} service_mail
 * @apiParam (body) {Date} answered
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 * {}
 */
ConsentRouter.route('/:id').patch(
  validator.body(consentSchema.update, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  ConsentController.update
)

/**
 * @api {get} v3/consent List consent by dist
 * @apiGroup Consent
 * @apiParam {String} dist
 * @apiParam {Boolean} fetched
 */
ConsentRouter.route('/').get(
  validator.headers(authSchema.header),
  AuthMiddleware.isAuthenticated,
  validator.query(consentSchema.list, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  ConsentController.list
)

module.exports = ConsentRouter
