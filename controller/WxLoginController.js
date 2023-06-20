/**
 * @param wechat_insert 验证微信接入
 */
// import { WxLoginService } from "../service/WxLoginService";
const WxLoginService = require("../service/WxLoginService");

const WxLoginController = {
  wechat_insert: (req, res) => {
    let { signature, timestamp, nonce, echostr } = req.query;
    let handleRes = WxLoginService.wechat_insert(
      signature,
      timestamp,
      nonce,
      echostr
    );
    res.send(handleRes);
  },
  login: async (req, res) => {
    let handleRes = await WxLoginService.login();
    res.send(handleRes);
  },
  wechat_message: async (req, res) => {
    let handleRes = await WxLoginService.wechat_message(req);
    res.send(handleRes);
  },
  check_scan: async (req, res) => {
    let handleRes = await WxLoginService.check_scan(req);
    res.send(handleRes);
  },
};

module.exports = WxLoginController;
