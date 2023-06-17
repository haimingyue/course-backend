const express = require("express");
const router = express.Router();
const WxLoginController = require("../controller/WxLoginController");

// 微信验证接入接口
router.get("/callback", WxLoginController.wechat_insert);

// 获取微信二维码
router.get("/login", WxLoginController.login);

// 微信回调发送用户信息接口
router.post("/callback", WxLoginController.wechat_message);

module.exports = router;
