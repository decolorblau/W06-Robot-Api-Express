const express = require("express");
const { getRobots } = require("../controller/robotsController");

const router = express.Router();

router.get("/", getRobots);

module.exports = router;
