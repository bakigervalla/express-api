const Joi = require('joi')

const ImageSchema = {
  onGetUploadUrl: Joi.object().keys({
    filename: Joi.string().required(),
    entity_id: Joi.string().required(),
  }),
  onDelete: Joi.object().keys({
    url: Joi.string().required(),
  }),
}

module.exports = ImageSchema
