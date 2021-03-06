const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    const error = new Error("Unauthorized");
    error.code = 401;
    next(error);
  } else {
    const token = authHeader.split(" ")[1];
    if (!token) {
      const error = new Error("Unauthorized");
      error.code = 401;
      next(error);
    } else {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        res.userId = user.id;
        next();
      } catch {
        const error = new Error("Unauthorized");
        error.code = 401;
        next(error);
      }
    }
  }
};

module.exports = auth;
