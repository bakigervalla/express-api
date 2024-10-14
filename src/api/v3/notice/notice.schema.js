const BaseJoi = require('joi')
const Extension = require('joi-date-extensions')
const Joi = BaseJoi.extend(Extension)

module.exports = {
  create: Joi.object().keys({
    regid: Joi.string().required(),
    sename: Joi.string().required(),
    sephone: Joi.string().required(),
    cuname: Joi.string().required(),
    cumobile: Joi.string().required(),
    pictureid: Joi.string().required(),
    text: Joi.string().required(),
  }),
  query: Joi.object().keys({
    start_date: Joi.date().format('YYYY-MM-DD').required(),
    end_date: Joi.date().format('YYYY-MM-DD').required(),
    is_sold: Joi.bool().optional().allow(null).default(null),
  }),
  update: Joi.object().keys({
    is_sold: Joi.bool().required(),
    new_reg_id: Joi.string().optional().allow(null).allow(''),
  }),
}
