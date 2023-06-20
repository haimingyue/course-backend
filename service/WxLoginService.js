const SecretTool = require("../utils/SecretTool");
const { getOR } = require("../config/wechatLogin");
const redisConfig = require("../config/redisConfig");
const BackCode = require("../utils/BackCode");
const WxDataTool = require("../utils/WxDataTool");
const DB = require("../config/sequelize");
const RandomTool = require("../utils/RandomTool");
const CodeEnum = require("../utils/CodeEnum");

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
    return BackCode.buildSuccessAndData({
      data: {
        qrcodeUrl,
        ticket,
      },
    });
  },
  wechat_message: async (req) => {
    // 获取微信侧数据
    let xmlStr = await WxDataTool.getXMLStr(req);
    let json = await WxDataTool.parseXMLToJson(xmlStr);
    let message = WxDataTool.formatMessage(json.xml);

    // 返回数据给微信侧
    let openidRes = await DB.Account.findAll({
      where: { openid: message.FromUserName },
      raw: true,
    });

    let head_img = RandomTool.randomAvatar();
    let username = RandomTool.randomName();

    let user = null;
    if (openidRes.length === 0) {
      // 未注册
      let resData = await DB.Account.create({
        openid: message.FromUserName,
        head_img,
        username,
      });
      user = { head_img, username, id: resData.toJSON().id };
    } else {
      // 已注册
      user = {
        head_img: openidRes[0].head_img,
        username: openidRes[0].username,
        id: openidRes[0].id,
      };
    }

    let token = SecretTool.jwtSign(user, "168h");
    let key = `wechat:ticket:${message.Ticket}`;
    const existsKet = await redisConfig.exists(key);
    if (existsKet) {
      await redisConfig.set(
        key,
        JSON.stringify({
          isScan: "yes",
          token,
        }),
        120
      );
    }

    let content = "";
    if (message.MsgType === "event") {
      content =
        message.Event === "subscribe"
          ? "欢迎您关注小滴课堂公众号"
          : "欢迎您再次关注小滴课堂公众号";
      let msgStr = `<xml>
            <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
            <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
            <CreateTime>${Date.now()}</CreateTime>
            <MsgType><![CDATA[text]]></MsgType>
            <Content><![CDATA[${content}]]></Content>
          </xml>`;
      return msgStr;
    }
  },
  check_scan: async (req) => {
    let { ticket } = req.query;
    let key = `wechat:ticket:${ticket}`;
    const existsKet = await redisConfig.exists(key);
    if (existsKet) {
      let data = await redisConfig.get(key);
      let { isScan, token } = JSON.parse(data);
      if (isScan === "yes") {
        return BackCode.buildSuccessAndData({ data: `Bearer ${token}` });
      } else {
        return BackCode.buildResult(CodeEnum.WECHAT_WAIT_SCAN);
      }
    } else {
      return BackCode.buildError("二维码已失效");
    }
  },
};

module.exports = WxLoginService;
