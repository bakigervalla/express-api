const express = require('express')
const AuthSchema = require('../../common/schemas/auth.schema')
const HistoryController = require('./history.controller')
const validator = require('express-joi-validation')({})
const HistorySchema = require('./history.schema')
const AuthMiddleware = require('../common/auth.middleware')

const HistoryRouter = new express.Router()

/**
 * @api {post} v3/history List history
 */
HistoryRouter.get(
  '/',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  HistoryController.all
)

/**
 * @api {post} v3/history Create history
 * @apiGroup History
 * @apiParam {String} [customer_phone]
 * @apiParam {Boolean} [has_history]
 * @apiParam {Boolean} [has_xtra]
 * @apiParam {Object} [history]
 * @apiParam {String} [history.dist]
 * @apiParam {String} [history.has_history]
 * @apiParam {Date} [history.invoice_date]
 * @apiParam {String} [history.invoice_no]
 * @apiParam {String} [history.mechanic]
 * @apiParam {String} [history.mileage]
 * @apiParam {String} [history.order_type]
 * @apiParam {String} [history.signature]
 * @apiParam {String} [history.status]
 * @apiParam {Array[String]} [history.text]
 * @apiParam {Date} [mob_expiry_date]
 * @apiParam {Date} [next_pkk_service]
 * @apiParam {Date} [next_service_date]
 * @apiParam {Date} [next_work_date]
 * @apiParam {String} regno
 * @apiParam {String} workshop_name
 */
HistoryRouter.post(
  '/',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isAuthenticated,
  validator.body(HistorySchema.onCreate, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  HistoryController.create
)

/**
 * @api {get} v3/history/:regno By regno
 * @apiGroup History
 * @apiParam {String} regno
 */
HistoryRouter.get('/:regno', HistoryController.historyByRegno)

/**
 * @api {get} v3/history/:regno/:phone By regno and phone
 * @apiGroup History
 * @apiParam {String} regno
 * @apiParam {String} phone
 */
HistoryRouter.get('/:regno/:phone', HistoryController.myHistory)

HistoryRouter.delete(
  '/:regno',
  validator.headers(AuthSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  HistoryController.deleteHistoryForVehicle
)

module.exports = HistoryRouter
