const bcrypt = require("bcrypt");
const chalk = require("chalk");
const debug = require("debug");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");
require("dotenv").config();

const getUser = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });

    if (!user) {
      const error = new Error("Wrong credentials");
      error.code = 401;
      next(error);
    } else {
      const rightPassword = await bcrypt.compare(password, user.password);

      if (!rightPassword) {
        const error = new Error("Wrong credentials 2");
        debug(chalk.red(error.message));
        error.code = 401;
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
  } catch {
    const error = new Error("Error logging in the user");
    error.code = 401;
    next(error);
  }
};

const createUser = async (req, res, next) => {
  const { name, userName, password } = req.body;
  try {
    const user = await User.findOne({ userName });

    if (!user) {
      const newUser = await User.create({
        name,
        userName,
        password: await bcrypt.hash(password, 10),
      });
      res.status(201).json(newUser);
      debug(chalk.green("User registered correctly"));
    } else {
      const error = new Error("This email is already registered");
      error.code = 401;
      next(error);
    }
  } catch {
    const error = new Error("Error creating the user");
    error.code = 401;
    debug(chalk.red(error.message));
    next(error);
  }
};

module.exports = {
  getUser,
  createUser,
};
