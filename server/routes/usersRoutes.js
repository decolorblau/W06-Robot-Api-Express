const express = require("express");
const { getUser } = require("../controller/usersController");

const router = express.Router();

router.post("/login", getUser);

/* router.get("/", async () => {
  User.create({
    name: "primer usuari",
    userName: "The First",
    password: await bcrypt.hash("primeraPatata", 10),
  });
}); */

module.exports = router;
