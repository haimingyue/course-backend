/**
 * @param wechat_insert 验证微信接入
 */
// import { WxLoginService } from "../service/WxLoginService";
const WxLoginService = require("../service/WxLoginService");

const WxLoginController = {
  wechat_insert: (req, res) => {
    console.log("req", req);
    let { signature, timestamp, nonce, echostr } = req.query;
    let handleRes = WxLoginService.wechat_insert(
      signature,
      timestamp,
      nonce,
      echostr
    );
    res.send(handleRes);
  },
};

module.exports = WxLoginController;
