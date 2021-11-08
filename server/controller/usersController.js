const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");

const getUser = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOnly({ userName });
    if (!user) {
      const error = new Error("Robot not found");
      error.code = 404;
      next(error);
    } else {
      const rightPassword = await bcrypt.compare(password, user.password);

      if (!rightPassword) {
        const error = new Error("user not found");
        error.code = 404;
        next(error);
      } else {
        const token = jwt.sign(
          {
            id: user.id,
            userName: user.userName,
          },
          process.env.JWT_SECRET,
          { expiresIn: 24 * 60 * 60 }
        );
        res.json({ token });
      }
    }
  } catch (error) {
    error.code = 401;
    next(error);
  }
};

module.exports = {
  getUser,
};
