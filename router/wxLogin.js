const express = require("express");
const router = express.Router();
const WxLoginController = require("../controller/WxLoginController");

router.get("/callback", WxLoginController.wechat_insert);

// 获取微信二维码
router.get("/login", WxLoginController.login);

module.exports = router;
