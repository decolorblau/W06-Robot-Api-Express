const { Joi } = require("express-validation");

const loginRequestSchema = {
  body: Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
module.exports = { loginRequestSchema };
