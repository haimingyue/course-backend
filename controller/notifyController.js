const NotifyService = require("../service/notifyService");
const GetUserInfoTool = require("../utils/GetUserInfoTool");
const SecretTool = require("../utils/SecretTool");
const RandomTool = require("../utils/RandomTool");

const NotifyController = {
  captcha: (req, res) => {
    let { type } = req.query;
    // 用户的Ip + 设备 md5加密
    let _key = SecretTool.md5(
      GetUserInfoTool.getIp(req) + GetUserInfoTool.getUseragent(req)
    );
    let handleRes = NotifyService.captcha(_key, type);
    res.set("Content-Type", "image/svg+xml");
    res.send(handleRes);
  },

  sendCode: async (req, res) => {
    let { phone, captcha, type } = req.body;
    // 用户的Ip + 设备 md5加密
    let _key = SecretTool.md5(
      GetUserInfoTool.getIp(req) + GetUserInfoTool.getUseragent(req)
    );
    let handleRes = NotifyService.sendCode(
      phone,
      captcha,
      type,
      _key,
      RandomTool.randomCode()
    );
    res.send(handleRes);
  },
};

module.exports = NotifyController;
