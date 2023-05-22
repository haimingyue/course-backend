const svgCaptcha = require("svg-captcha");

const redisConfig = require("../config/redisConfig");
const NotifyService = {
  captcha: async (req, res) => {
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: "0o1i",
      noise: 1,
      color: true,
      background: "#aaa",
    });
    // req.session.captcha = captcha.text;
    // res.type("svg");
    // res.status(200).send(captcha.data);
    redisConfig.set("captcha", captcha.text, 600);
    return captcha.data;
  },
};

module.exports = NotifyService;