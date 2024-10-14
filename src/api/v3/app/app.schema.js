const Joi = require('joi')

const AppSchema = {
  onCreate: Joi.object().keys({
    name: Joi.string().required(),
    active: Joi.boolean().required(),
  }),
  onPatch: Joi.object()
    .keys({
      app_id: Joi.number(),
      name: Joi.string(),
      active: Joi.boolean(),
    })
    .or('name', 'active'),
  onCreateSetting: Joi.object().keys({
    key: Joi.string().required(),
  }),
}

module.exports = AppSchema
