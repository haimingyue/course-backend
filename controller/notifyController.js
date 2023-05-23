const NotifyService = require("../service/notifyService");
const GetUserInfoTool = require("../utils/GetUserInfoTool");
const SecretTool = require("../utils/SecretTool");

// 用户的Ip + 设备 md5加密

const getKey = (req) => {
  return SecretTool.md5(
    GetUserInfoTool.getIp(req) + GetUserInfoTool.getUseragent(req)
  );
};

const NotifyController = {
  captcha: async (req, res) => {
    let { type } = req.query;
    let _key = getKey(req);
    let handleRes = await NotifyService.captcha(_key, type);
    res.set("Content-Type", "image/svg+xml");
    res.send(handleRes);
  },
};

module.exports = NotifyController;
