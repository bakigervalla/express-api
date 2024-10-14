const Joi = require('joi')
const WebOrderOptions = require('./web-order-options')
const orderTypeNames = WebOrderOptions.map((opt) => opt.name)
const orderTypeDuration = WebOrderOptions.map((opt) => opt.duration)

module.exports = {
  create: Joi.object().keys({
    first_name: Joi.string().required().allow(''),
    middle_name: Joi.string().required().allow(''),
    last_name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().allow(''),
    regno: Joi.string().required(),
    street: Joi.string().required(),
    zip: Joi.string().required(),
    city: Joi.string().required(),
    order_type_name: Joi.string().required(), // Joi.string().valid(orderTypeNames).required(),
    order_type_duration: Joi.alternatives().try(Joi.string(), Joi.number()).required(), // Joi.number().valid(orderTypeDuration).required(),
    workshop_id: Joi.number().required(),
    request: Joi.string().required().allow(''),
    message: Joi.string().required().allow(''),
    service_agreement: Joi.boolean().default(false),
  }),
  onFetch: Joi.object().keys({
    fetched: Joi.boolean().default(false),
    startAt: Joi.date().optional(),
  }),
  onAll: Joi.object().keys({
    startAt: Joi.date().required(),
    endAt: Joi.date().required(),
  }),
}
