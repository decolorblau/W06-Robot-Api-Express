const express = require("express");
const { validate } = require("express-validation");
const { getUser } = require("../controller/usersController");
const {
  loginRequestSchema,
} = require("../schemas/loginRequestSchema/loginRequestSchema");

const router = express.Router();

router.post("/login", validate(loginRequestSchema), getUser);

/* router.get("/", async () => {
  User.create({
    name: "primer usuari",
    userName: "The First",
    password: await bcrypt.hash("primeraPatata", 10),
  });
}); */

module.exports = router;
