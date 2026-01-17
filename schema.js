const Joi = require('joi');
const reviews = require('./models/reviews');

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.object({
      url: Joi.string().uri().required(),
      filename: Joi.string().required()
    }).optional()
  })
});

const reviewSchema = Joi.object({
   review:Joi.object({
  rating:Joi.number().required().min(1).max(5),
  comment:Joi.string().required(),
   }).required()
});

module.exports = { listingSchema, reviewSchema };