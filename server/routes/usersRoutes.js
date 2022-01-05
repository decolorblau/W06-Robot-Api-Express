const express = require("express");
const { validate } = require("express-validation");
const { getUser, createUser } = require("../controller/usersController");
const {
  loginRequestSchema,
} = require("../schemas/loginRequestSchema/loginRequestSchema");
const {
  signinRequestSchema,
} = require("../schemas/signinRequestSchema/signinRequestSchema");

const router = express.Router();

router.post("/login", validate(loginRequestSchema), getUser);
router.post("/signin", validate(signinRequestSchema), createUser);

module.exports = router;
