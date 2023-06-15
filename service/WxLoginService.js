const SecretTool = require("../utils/SecretTool");

const WxLoginService = {
  wechat_insert: (signature, timestamp, nonce, echostr) => {
    let token = "testxdclass";
    let t = [token, timestamp, nonce].sort().join("");
    let str = SecretTool.sha1(t);
    if (str === signature) {
      return echostr;
    }
  },
};

module.exports = WxLoginService;
