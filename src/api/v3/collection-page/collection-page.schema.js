const Joi = require('joi')

module.exports = {
  list: Joi.object().keys({
    withWorkshops: Joi.boolean().default(false),
  }),
  create: Joi.object().keys({
    name: Joi.string().required(),
    parent_id: Joi.number().optional().allow(''),
    hidden: Joi.boolean().default(false),
  }),
  addWorkshop: Joi.object().keys({
    workshop_id: Joi.number().required(),
  }),
}
