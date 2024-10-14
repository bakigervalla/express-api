const Joi = require('joi')
const moment = require('moment')

const AdItemSchema = {
  onSearch: Joi.object().keys({
    term: Joi.string().required(),
    field: Joi.string().valid(['description', 'articleNumber']).default('description'),
    sort: Joi.number(),
    limit: Joi.number().optional(),
    offset: Joi.number().optional(),
  }),
  onSearchBarcode: Joi.object().keys({
    wholesaleId: Joi.number().required(),
    barcode: Joi.string().required(),
  }),
  onOrder: Joi.object().keys({
    wholesale_id: Joi.number().required(),
    rows: Joi.array().items(Joi.any()).min(1).required(),
    customer_number: Joi.string().required(),
    app_id: Joi.number().required(),
    requisition_number: Joi.string().allow(null).allow(''),
    text: Joi.string().allow(null).allow(''),
  }),
  onListOrders: Joi.object().keys({
    start: Joi.date().default(moment().startOf('month').format('YYYY-MM-DD')),
    end: Joi.date().default(moment().endOf('month').format('YYYY-MM-DD')),
    appId: Joi.number().optional(),
  }),
}

module.exports = AdItemSchema
