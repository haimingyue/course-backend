const express = require("express");
const router = express.Router();
const NotifyController = require("../controller/notifyController");

router.get("/captcha", NotifyController.captcha);

router.post("/send_code", NotifyController.sendCode);

module.exports = router;
