const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");

router.post("/register", UserController.register);

module.exports = router;
