const express = require("express");
const {
  getRobots,
  getRobotById,
  createRobot,
} = require("../controller/robotsController");
const newToken = require("../middleware/newToken");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, getRobots);
router.get("/:idRobots", auth, getRobotById);
router.post("/create", newToken, createRobot);

module.exports = router;
