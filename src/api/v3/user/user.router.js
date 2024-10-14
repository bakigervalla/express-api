const express = require('express')
const validator = require('express-joi-validation')({})
const UserController = require('./user.controller')
const AuthMiddleware = require('../common/auth.middleware')
const authSchema = require('../../common/schemas/auth.schema')
const userSchema = require('./user.schema')

const UserRouter = new express.Router()

/**
 * @api {get} v3/user List
 * @apiGroup User
 */
UserRouter.route('/').get(
  validator.headers(authSchema.header),
  AuthMiddleware.isSuperuser,
  UserController.all
)

/**
 * @api {post} v3/user Create user
 * @apiGroup User
 * @apiParam {String} username
 * @apiParam {String} [password]
 * @apiParam {String='API','SUPERUSER','WORKSHOP'} role
 */
UserRouter.route('/').post(
  validator.headers(authSchema.header),
  AuthMiddleware.isSuperuser,
  validator.body(userSchema.create, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  UserController.create
)

/**
 * @api {get} v3/user Get by id
 * @apiGroup User
 * @apiParam {String} id
 */
UserRouter.route('/:id').get(
  validator.headers(authSchema.header),
  AuthMiddleware.isAuthenticated,
  UserController.findById
)

/**
 * @api {patch} v3/user/password Set a new password
 * @apiGroup User
 * @apiParam {String} id
 * @apiParam (body) {String} password
 */
UserRouter.route('/:id/set-password').patch(
  validator.headers(authSchema.header),
  AuthMiddleware.isSuperuser,
  UserController.setPassword
)

/**
 * @api {get} v3/user Send a new password
 * @apiGroup User
 * @apiParam {String} id
 */
UserRouter.route('/:id/send-new-password').get(
  validator.headers(authSchema.header),
  AuthMiddleware.isSuperuser,
  UserController.resetPassword
)

module.exports = UserRouter
