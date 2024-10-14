const Joi = require('joi')

module.exports = {
  create: Joi.object().keys({
    orderid: Joi.string().required(),
    regid: Joi.string().required(),
    sename: Joi.string().required(),
    sephone: Joi.string().required(),
    cuname: Joi.string().required(),
    cumobile: Joi.string().required(),
    text: Joi.string().required(),
    amount: Joi.string().required(),
    duration: Joi.string().required(),
    created: Joi.number().optional().allow(null),
    expires: Joi.number().optional().allow(null),
  }),
  update: Joi.object().keys({
    status: Joi.number().required(),
  }),
}
