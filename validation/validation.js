const Joi = require('@hapi/joi');

// Register Validation
const registerValidation = data => {
  const schema = Joi.object({
    email: Joi.string().email(),
    phone: Joi.string().regex(/^\d{10}$/)
  }).unknown(true);
  return Joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
