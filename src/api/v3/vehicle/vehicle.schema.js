const Joi = require('joi')

const VehicleSchema = {
  onGetVehicle: Joi.object().keys({
    regno: Joi.string().required(),
  }),
  onGetVehiclesByPhone: Joi.object().keys({
    phone: Joi.string().required(),
  }),
  onGetPersonByPhone: Joi.object().keys({
    person: Joi.string().required(),
  }),
  onUpdateSettings: Joi.object().keys({
    uuid: Joi.string().optional(),
    phone: Joi.string().required(),
    active: Joi.boolean().required(),
    description: Joi.string().optional().allow(''),
  }),
}

module.exports = VehicleSchema
