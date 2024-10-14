const express = require('express')
const VehicleController = require('./vehicle.controller')
const validator = require('express-joi-validation')({})
const VehicleSchema = require('./vehicle.schema')
const AuthSchema = require('../../common/schemas/auth.schema')
const AuthMiddleware = require('../common/auth.middleware')

const VehicleRouter = new express.Router()

/**
 * @api {get} v2/vehicle Get all vehicles
 * @apiGroup Vehicle
 */
VehicleRouter.get(
  '/',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  VehicleController.getAll
)

/**
 * @api {get} v2/vehicle/:regno
 * @apiGroup Vehicle
 * @apiParam {String} regno
 */
VehicleRouter.get(
  '/:regno',
  validator.params(VehicleSchema.onGetVehicle, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  VehicleController.getVehicleByRegNo
)

/**
 * @api {patch} v2/vehicle/:regno/settings
 * @apiGroup Vehicle
 * @apiParam (query) {String} regno
 * @apiParam (body) {String} phone
 * @apiParam (body) {Boolean} active
 * @apiParam (body) {String} description
 */
VehicleRouter.patch(
  '/:regno/settings',
  validator.body(VehicleSchema.onUpdateSettings, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  VehicleController.updateVehicleSettings
)

/**
 * @api {get} v2/vehicle/phone/:phone Get vehicles by customer phone number
 * @apiGroup Vehicle
 * @apiParam {String} phone
 */
VehicleRouter.get(
  '/phone/:phone',
  validator.params(VehicleSchema.onGetVehiclesByPhone, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  VehicleController.getVehiclesByPhone
)

/**
 * @api {get} v2/vehicle/findperson:phone
 * @apiGroup Vehicle
 * @apiParam {String} phone
 */
VehicleRouter.get(
  '/person/:phone',
  // validator.params(VehicleSchema.onGetPersonByPhone, {
  //   joi: { convert: true, allowUnknown: false, abortEarly: true },
  // }),
  VehicleController.getPersonByPhone
)

module.exports = VehicleRouter
