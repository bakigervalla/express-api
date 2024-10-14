const Joi = require('joi')

module.exports = {
  create: Joi.object().keys({
    orderid: Joi.string().required(),
    expires: Joi.number().allow(null),
    regid: Joi.string().required(),
    result: Joi.array().required(),
    sename: Joi.string().required(),
    sephone: Joi.string().required(),
    cuname: Joi.string().required(),
    cumobile: Joi.string().required(),
    booked: Joi.number().allow(null),
    created: Joi.number().allow(null),
    order: Joi.array().items(Joi.string()).allow(null),
  }),
  update: Joi.object().keys({
    order: Joi.array().items(Joi.string()).required(),
  }),
}
