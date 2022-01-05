const { Joi } = require("express-validation");

const signinRequestSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    userName: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
module.exports = { signinRequestSchema };
