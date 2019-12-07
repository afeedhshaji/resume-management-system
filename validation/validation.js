const Joi = require('@hapi/joi');

// Register Validation
const registerValidation = data => {
  const schema = Joi.object({
    email: Joi.string().email(),
  }).unknown(true);
  return Joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
