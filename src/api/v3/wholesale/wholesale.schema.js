const Joi = require('joi')

const WholesaleSchema = {
  onCreate: Joi.object().keys({
    name: Joi.string().required(),
    wholesale_number: Joi.number(),
    active: Joi.boolean().default(false),
  }),
  onUpdate: Joi.object()
    .keys({
      wholesaler_id: Joi.number(),
      name: Joi.string(),
      wholesale_number: Joi.number(),
      active: Joi.boolean(),
    })
    .or('name', 'wholesale_number', 'active'),
  onCustomerAuth: Joi.object().keys({
    workshop_number: Joi.number().required(),
    customer_number: Joi.number().required(),
    app_id: Joi.number().required(),
  }),
  onAddApp: Joi.object().keys({
    app_id: Joi.number().required(),
  }),
  onTireUpdate: Joi.object().keys({
    article_groups: Joi.array().items(Joi.string()).required(),
    left_over_stock_groups: Joi.array().items(Joi.string()).optional(),
  }),
}

module.exports = WholesaleSchema
