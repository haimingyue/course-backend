const axios = require("axios");

const AppCode = "9d1a02deaa57453e8d4aef10f8d1bb2c";

const sendMsgCode = (phone, randomCode) => {
  return axios({
    method: "POST",
    url: `https://jmsms.market.alicloudapi.com/sms/send?mobile=${phone}&templateId=JM1000372&value=${randomCode}`,
    headers: {
      authorization: `AppCode ${AppCode}`,
    },
  });
};

module.exports = sendMsgCode;
