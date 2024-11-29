const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    location: Joi.string().optional(),
    country: Joi.string().optional(),
    price: Joi.number().optional().min(0),
    image: Joi.object({
      url: Joi.string().uri().allow('', null).optional(), // Image is optional
    }).optional(),
  }).required(),
});
