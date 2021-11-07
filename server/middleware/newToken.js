require("dotenv").config();

const token = process.env.ROBOT_TOKEN;

const newToken = (req, res, next) => {
  if (token === req.query.token) {
    next();
  } else {
    const error = new Error(
      "You are not a VIP person. This token is incorrect."
    );
    error.code = 401;
    next(error);
  }
};

module.exports = newToken;
