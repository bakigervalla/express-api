const Joi = require('joi')

module.exports = {
  query: Joi.object().keys({
    appId: Joi.number(),
  }),
  search: Joi.object().keys({
    term: Joi.string(),
    appId: Joi.number().optional(),
  }),
  slug: Joi.object().keys({
    slug: Joi.string(),
  }),
  onCreate: Joi.object().keys({
    dist: Joi.string().optional(),
    name: Joi.string().required(),
    slug: Joi.string().required(),
    street: Joi.string().optional(),
    zip: Joi.string().optional(),
    city: Joi.string().optional(),
    county: Joi.string().optional(),
    lat: Joi.number().optional(),
    long: Joi.number().optional(),
    email: Joi.string().optional(),
    phone: Joi.string().optional(),
    active: Joi.boolean().default(true),
    wholesaler_id: Joi.number().optional(),
    customer_number: Joi.number().optional(),
    workshop_number: Joi.number().optional(),
    facebook: Joi.string().optional(),
    homepage: Joi.string().optional(),
    free_text: Joi.string().optional(),
    instagram_url: Joi.string().optional(),
  }),
  onImage: {
    image_url: Joi.string().required(),
  },
  onPatch: Joi.object()
    .keys({
      workshop_id: Joi.number(),
      dist: Joi.string().allow(null).allow(''),
      name: Joi.string().allow(null).allow(''),
      slug: Joi.string().allow(null).allow(''),
      street: Joi.string().allow(null).allow(''),
      zip: Joi.string().allow(null).allow(''),
      city: Joi.string().allow(null).allow(''),
      county: Joi.string().allow(null).allow(''),
      lat: Joi.number().allow(null).allow(''),
      long: Joi.number().allow(null).allow(''),
      email: Joi.string().allow(null).allow(''),
      phone: Joi.string().allow(null).allow(''),
      facebook: Joi.string().allow(null).allow(''),
      homepage: Joi.string().allow(null).allow(''),
      free_text: Joi.string().allow(null).allow(''),
      active: Joi.boolean().allow(null).allow(''),
      wholesaler_id: Joi.number().optional().allow(null),
      customer_number: Joi.number().allow(null),
      workshop_number: Joi.number().allow(null),
      wholesaler_name: Joi.string().allow(null),
      apps: Joi.array(),
      opening_hours: Joi.object({
        openingHoursSpecification: Joi.array()
          .items(
            Joi.object({
              dayOfWeek: Joi.array().items(
                Joi.string().valid(
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday'
                )
              ),
              opens: Joi.string(),
              closes: Joi.string(),
            })
          )
          .optional(),
      }),
      affiliation: Joi.number().optional().allow(null),
      instagram_url: Joi.string().optional(),
    })
    .or(
      'dist',
      'name',
      'slug',
      'street',
      'zip',
      'city',
      'county',
      'email',
      'phone',
      'facebook',
      'homepage',
      'free_text',
      'lat',
      'long',
      'active',
      'wholesaler',
      'customer_number',
      'workshop_number',
      'wholesaler_id',
      'opening_hours',
      'affiliation'
    ),
  onAddApp: Joi.object().keys({
    app_id: Joi.number().required(),
  }),
  onMeta: Joi.object().keys({
    title: Joi.string().required().allow(''),
  }),
  onUpdateAppSetting: Joi.object().keys({
    app_setting_id: Joi.number().required(),
    value: Joi.string().required(),
  }),
}
