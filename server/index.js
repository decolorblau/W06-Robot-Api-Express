const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const chalk = require("chalk");
const debug = require("debug")("robots:server");
const {
  notFoundErrorHandler,
  generalErrorHandler,
} = require("./middleware/error");
const robotsRoutes = require("./routes/robotsRoutes");
const usersRoutes = require("./routes/usersRoutes");
const auth = require("./middleware/auth");

const app = express();

const initializeServer = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.green(`listening ${port} port`));
      resolve(server);
    });
    server.on("error", (error) => {
      debug(chalk.redBright("There was an error starting the server."));
      if (error.code === "EADDRINUSE") {
        debug(chalk.red(`The port ${port} is in use.`));
      }
      reject();
    });
    server.on("close", () => {
      debug(chalk.yellow("server express disconnected"));
    });
  });

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/users", usersRoutes);
app.use("/robots", auth, robotsRoutes);
app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

module.exports = { initializeServer, app };
