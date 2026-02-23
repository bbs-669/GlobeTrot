const Joi = require("joi");

const listingSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .pattern(/^[A-Za-z\s,.-]+$/)
    .required(),

  description: Joi.string()
    .trim()
    .min(10)
    .max(1000)
    .required()
    .messages({
    "string.base": "Description must be a text value",
    "string.empty": "Description cannot be empty",
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description must be less than 1000 characters",
    "string.pattern.base": "Description can contain letters, numbers, spaces, commas, dots and hyphens only",
    "any.required": "Description is required"
  }),

  price: Joi.number()
    .min(0)
    .required(),

  location: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .pattern(/^[A-Za-z0-9\s,.-]+$/)
    .required(),
  country: Joi.string()
    .trim()
    .min(2)
    .pattern(/^[A-Za-z\s]+$/)
    .required()
});


const reviewSchema = Joi.object({
    rating: Joi.number()
        .min(1),
    comment: Joi.string()
        .trim()
        .min(3)
        .max(500)
        .messages({
    "string.base": "Comment must be a text value",
    "string.empty": "Comment cannot be empty",
    "string.min": "Comment must be at least 3 characters long",
    "string.max": "Comment must be less than 500 characters",
    "string.pattern.base": "Comment can contain letters, numbers, spaces, commas, dots and hyphens only",
    "any.required": "Comment is required"
  })
});

const userSchema = Joi.object({
username: Joi.string()
  .trim()
  .min(3)
  .max(30)
  .pattern(/^[a-zA-Z0-9._-]+$/)
  .required()
  .messages({
    "string.empty": "Username is required",
    "string.pattern.base":
      "Username can contain letters, numbers, dots, underscores, and hyphens",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must be at most 30 characters long"
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Enter a valid email address"
    }),

  password: Joi.string()
    .min(6)
    .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)"))
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
      "string.pattern.base":
        "Password must contain at least one letter and one number"
    })
});


module.exports = { listingSchema, reviewSchema,userSchema };