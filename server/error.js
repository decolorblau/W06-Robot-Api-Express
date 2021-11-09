const { ValidationError } = require("express-validation");
const debug = require("debug")("robots:errors");

const notFoundErrorHandler = (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
};

// eslint-disable-next-line no-unused-vars
const generalErrorHandler = (error, req, res, next) => {
  debug("Something its wrong: ", error.message);
  if (error instanceof ValidationError) {
    error.code = 400;
    error.message = "Evil request";
  }
  const message = error.code ? error.message : "The world is coming to end";
  res.status(error.code || 500).json({ error: message });
};

module.exports = {
  notFoundErrorHandler,
  generalErrorHandler,
};
