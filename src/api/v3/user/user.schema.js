const Joi = require('joi')

module.exports = {
  create: Joi.object().keys({
    username: Joi.string().required().min(3),
    role: Joi.boolean().required().allow('API', 'SUPERUSER', 'WORKSHOP'),
  }),
}
