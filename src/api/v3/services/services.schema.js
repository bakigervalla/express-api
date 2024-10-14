const Joi = require('joi')

const ServicesSchema = {
  onGetServices: Joi.object().keys({
    workshop_id: Joi.number().required(),
  }),
  onUpdateService: Joi.object().keys({
    id: Joi.number().required(),
    category_id: Joi.number().required(),
    code: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().optional().allow(''),
    duration: Joi.number().required(),
    is_active: Joi.boolean().default(true),
  }),
  onCreateService: Joi.object().keys({
    category_id: Joi.number().required(),
    code: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().optional().allow(''),
    duration: Joi.number().required(),
    is_active: Joi.boolean().default(true),
  }),
  onGetCategories: Joi.object().keys({
    workshop_id: Joi.string().required(),
  }),
  onUpdateCategory: Joi.object().keys({
    id: Joi.number().required(),
    workshop_id: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().optional().allow(''),
    is_active: Joi.boolean().default(true),
  }),
  onCreateCategory: Joi.object().keys({
    workshop_id: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().optional(),
    is_active: Joi.boolean().default(true),
  }),
}

module.exports = ServicesSchema
