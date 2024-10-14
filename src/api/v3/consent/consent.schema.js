const Joi = require('joi')

module.exports = {
  create: Joi.object().keys({
    dist: Joi.string().required(),
    cuno: Joi.string().required(),
    cuname: Joi.string().required(),
    cumobile: Joi.string().required(),
    cuaddress: Joi.string(),
    sename: Joi.string().required(),
    sephone: Joi.string().required(),
  }),
  update: Joi.object().keys({
    market_info_sms: Joi.boolean().required(),
    market_info_mail: Joi.boolean().required(),
    reminder_sms: Joi.boolean().required(),
    reminder_mail: Joi.boolean().required(),
    service_sms: Joi.boolean().required(),
    service_mail: Joi.boolean().required(),
  }),
  list: Joi.object().keys({
    dist: Joi.string().required(),
    fetched: Joi.boolean(),
  }),
}
