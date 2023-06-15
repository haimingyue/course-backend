const express = require("express");
const router = express.Router();
const WxLoginController = require("../controller/WxLoginController");

router.get("/callback", WxLoginController.wechat_insert);

module.exports = router;
