const debug = require("debug")("robots:errors");

const notFoundErrorHandler = (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
};

const generalErrorHandler = (error, req, res, next) => {
  debug("Something its wrong: ", error.message);
  const message = error.code ? error.message : "The world is coming to end";
  res.status(error.code || 500).json({ error: message });
};

module.exports = {
  notFoundErrorHandler,
  generalErrorHandler,
};
