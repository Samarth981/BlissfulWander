const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.object({
      url: Joi.string().uri().allow('', null),
    }).optional(),
    category: Joi.string()
      .valid(
        'Rooms',
        'Iconic cities',
        'Castle',
        'Village',
        'Mountrest',
        'Junglehut',
        'Farms',
        'Beach',
        'ski-in/out',
        'Amazing pools',
        'Arctic',
      )
      .required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(0).max(5),
    comment: Joi.string().required(),
  }).required(),
});
