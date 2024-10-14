const express = require('express')
const validator = require('express-joi-validation')({})
const QuoteController = require('./quote.controller')
const AuthMiddleware = require('../../common/middleware/auth.middleware')
const authSchema = require('../../common/schemas/auth.schema')
const QuoteSchema = require('./quote.schema')

const QuoteRouter = new express.Router()

/**
 * @api {post} v3/quote Create a new quote object
 * @apiHeader (Headers) {String} authorization Authorization token
 * @apiGroup Quote
 * @apiParam {String} orderid The Cars order id
 * @apiParam {String} regid Car registration id
 * @apiParam {String} sename Company name
 * @apiParam {String} sephone Company phone number
 * @apiParam {String} cuname Customer name
 * @apiParam {String} cumobile Customer mobile phone number
 * @apiParam {String} text The text
 * @apiParam {String} amount The amount
 * @apiParam {String} duration The duration
 */
QuoteRouter.route('/').post(
  validator.headers(authSchema.header),
  AuthMiddleware.isAuthenticated,
  validator.body(QuoteSchema.create),
  QuoteController.create
)

/**
 * @api {get} v3/quote/{:id} Get a quote object
 * @apiName GetQuote
 * @apiGroup Quote
 */
QuoteRouter.route('/:id').get(QuoteController.findOne)

/**
 * @api {patch} v3/quote/{:id} Update quote object
 * @apiName GetQuote
 * @apiGroup Quote
 * @apiParam (body) {number} status
 */
QuoteRouter.route('/:id').patch(validator.body(QuoteSchema.update), QuoteController.update)

module.exports = QuoteRouter
