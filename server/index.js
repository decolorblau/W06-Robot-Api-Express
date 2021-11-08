const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const chalk = require("chalk");
const debug = require("debug")("robots:server");
const { notFoundErrorHandler, generalErrorHandler } = require("./error");
const robotsRoutes = require("./routes/robotsRoutes");
const usersRoutes = require("./routes/usersRoutes");

const app = express();

const initializeServer = (port) => {
  const server = app.listen(port, () => {
    debug(chalk.green(`listening ${port} port`));
  });

  server.on("error", (error) => {
    debug(chalk.redBright("There was an error starting the server."));
    if (error.code === "EADDRINUSE") {
      debug(chalk.red(`The port ${port} is in use.`));
    }
  });
};

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/robots", cors(), robotsRoutes);
app.use("/users", cors(), usersRoutes);
app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

module.exports = initializeServer;
