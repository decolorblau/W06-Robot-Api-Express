const debug = require("debug")("robots:database");
const chalk = require("chalk");
const mongoose = require("mongoose");

const connectDB = () =>
  new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGODB_ROBOTS, (error) => {
      if (error) {
        debug(
          chalk.redBright("The database could not be started", error.message)
        );
        reject();
        return;
      }
      debug(chalk.green("The database is connected"));
      resolve();
    });
  });

module.exports = connectDB;
