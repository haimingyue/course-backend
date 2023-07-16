const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");

router.post("/register", UserController.register);
router.post("/forget", UserController.forget);
// 账号密码接口
router.post("/login", UserController.login);

module.exports = router;
