const Joi = require('joi');

const ReviewsSchema = Joi.object({
    rating: Joi.number().min(1).max(5),
    comments: Joi.string().required(),
    date: Joi.date().optional(),
  });
  
module.exports = ReviewsSchema;
