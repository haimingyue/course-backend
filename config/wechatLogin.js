const axios = require("axios");

const appId = "wxf6b1d8255b516d92";
const appSecret = "ae69c6e0b374dc207eb4159498bb43b9";
const accessTokenPC = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
const qrUrl = "https://mp.weixin.qq.com/cgi-bin/showqrcode";

// 获取accessToken
const getAccessToken = () => {
  return axios({
    method: "get",
    url: accessTokenPC,
  });
};

// 获取ticket
const getTicket = (token) => {
  return axios({
    method: "post",
    url: `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${token}`,
    data: {
      expire_seconds: 60 * 2,
      action_name: "QR_SCENE",
      action_info: { scene: { scene_id: 123 } },
    },
  });
};

// 获取微信二维码URL
const wechatLogin = {
  getOR: async () => {
    let token = (await getAccessToken()).data.access_token;
    let ticket = (await getTicket(token)).data.ticket;
    return {
      qrcodeUrl: `${qrUrl}?ticket=${ticket}`,
      ticket: ticket,
    };
  },
};

module.exports = wechatLogin;
