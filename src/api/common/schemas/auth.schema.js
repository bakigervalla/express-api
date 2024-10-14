const Joi = require('joi')

module.exports = {
  header: Joi.object().keys({
    authorization: Joi.string().required(),
  }),
  user: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
  bilxtra: Joi.object().keys({
    phone: Joi.string().required(),
    regno: Joi.string().required(),
  }),
}
