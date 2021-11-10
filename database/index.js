const debug = require("debug")("robots:database");
const chalk = require("chalk");
const mongoose = require("mongoose");

const connectDB = (connectionDB) =>
  new Promise((resolve, reject) => {
    mongoose.set("debug", false); // consolea base de datos cuando esta en true.

    mongoose.connect(connectionDB, (error) => {
      if (error) {
        debug(
          chalk.redBright("The database could not be started", error.message)
        );
        debug(chalk.red(error.message));

        reject();
        return;
      }
      debug(chalk.green("The database is connected"));
      resolve();
    });
    mongoose.connection.on("close", () => {
      debug(chalk.green("DB disconnected"));
    });
  });

module.exports = connectDB;
