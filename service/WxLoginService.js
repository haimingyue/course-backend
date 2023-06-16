const SecretTool = require("../utils/SecretTool");
const { getOR } = require("../config/wechatLogin");
const redisConfig = require("../config/redisConfig");
const Backcode = require("../utils/Backcode");

const WxLoginService = {
  wechat_insert: (signature, timestamp, nonce, echostr) => {
    let token = "testxdclass";
    let t = [token, timestamp, nonce].sort().join("");
    let str = SecretTool.sha1(t);
    if (str === signature) {
      return echostr;
    }
  },
  login: async () => {
    let { qrcodeUrl, ticket } = await getOR(); // 获取微信二维码URL
    // 将ticket存入redis
    let key = `wechat:ticket:${ticket}`;
    redisConfig.set(
      key,
      JSON.stringify({
        isScan: "no",
      }),
      120
    );
    console.log("qrcodeUrl", qrcodeUrl);
    return Backcode.buildSuccessAndData({
      data: {
        qrcodeUrl,
        ticket,
      },
    });
  },
};

module.exports = WxLoginService;
