const express = require("express");
const {
  getRobots,
  getRobotById,
  createRobot,
} = require("../controller/robotsController");
const newToken = require("../middleware/newToken");

const router = express.Router();

router.get("/", getRobots);
router.get("/:idRobots", getRobotById);
router.post("/create", newToken, createRobot);

module.exports = router;
