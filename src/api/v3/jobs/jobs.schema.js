const Joi = require('joi')

module.exports = {
  onAddJob: Joi.object().keys({
    workshop_id: Joi.number().required(),
    email: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
  onSendJobByEmail: Joi.object().keys({
    to_email: Joi.string().required(),
    job_title: Joi.string().required(),
    email: Joi.string().required(),
    full_name: Joi.string().required(),
    mobile_number: Joi.string().required(),
    cv: Joi.object(),
    coverLetter: Joi.object(),
  }),
}
