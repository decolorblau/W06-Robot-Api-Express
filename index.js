require("dotenv").config();
const connectDB = require("./database/index");
const { initializeServer } = require("./server/index");

const port = process.env.PORT ?? process.env.SERVER_PORT ?? 4000;

(async () => {
  try {
    await connectDB(process.env.MONGODB_ROBOTS);
    initializeServer(port);
  } catch (error) {
    process.exit(1);
  }
})();
