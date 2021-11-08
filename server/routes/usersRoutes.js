const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../database/models/user");
const { getUsers } = require("../controller/usersController");

const router = express.Router();

router.get("/", getUsers);

/* router.get("/", async () => {
  User.create({
    name: "primer usuari",
    userName: "The First",
    password: await bcrypt.hash("primeraPatata", 10),
  });
}); */

module.exports = router;
