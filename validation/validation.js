const Joi = require('@hapi/joi');

// Register Validation
const registerValidation = data => {
  const schema = Joi.object({
    email: Joi.string().email()
  }).unknown(true);
  return Joi.validate(data, schema);
};

// Admin Register Validation
const adminRegisterValidation = function(data) {
  const schema = {
    name: Joi.string()
      .min(6)
      .required(),
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required()
  };
  return Joi.validate(data, schema);
};

// Admin Login Validation
const adminLoginValidation = function(data) {
  const schema = {
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required()
  };
  return Joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.adminRegisterValidation = adminRegisterValidation;
module.exports.adminLoginValidation = adminLoginValidation;
