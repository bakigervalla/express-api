const express = require('express')
const validator = require('express-joi-validation')({})
const AuthController = require('./auth.controller')
const authSchema = require('../../common/schemas/auth.schema')

const AuthRouter = new express.Router()

/**
 * @api {post} v3/authenticate Authenticate
 * @apiGroup Authorization
 * @apiParam {String} username Username
 * @apiParam {String} password Password
 * @apiParamExample {json} Example request:
 * {
 *    "username": "yourusername",
 *    "password": "yourpassword"
 * }
 *
 * @apiSuccessExample {json} Success response:
 * HTTP/1.1 200 OK
 * {
 *   "token": "eyJpc3MiOiJ0b3B0YWwuY29tIiwiZXhwIjoxNDI2NDIwODAwLCJodHRwOi8vdG9wdGFsLmNvbS9qd3RfY2xhaW1zL2lzX2FkbWluIjp0cnVlLCJjb21wYW55IjoiVG9wdGFsIiwiYXdlc29tZSI6dHJ1ZX0"
 * }
 */
AuthRouter.route('/').post(
  validator.body(authSchema.user, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AuthController.authenticate
)

/**
 * @api {post} v3/bilxtra-web Authenticate for bilxtra website
 * @apiGroup Authorization
 * @apiParam {String} phone Phone number
 * @apiParam {String} regno Registration number
 */
AuthRouter.route('/bilxtra-web').post(
  validator.body(authSchema.bilxtra, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AuthController.authenticateBilxtraWeb
)

module.exports = AuthRouter
