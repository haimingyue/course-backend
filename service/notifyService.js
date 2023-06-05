const svgCaptcha = require("svg-captcha");

const redisConfig = require("../config/redisConfig");
const aliyunMessage = require("../config/aliyunMessage");
const dayjs = require("dayjs");
const BackCode = require("../utils/BackCode");
const CodeEnum = require("../utils/CodeEnum");

const NotifyService = {
  captcha: (key, type) => {
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
    redisConfig.set(`${type}:captcha:` + key, captcha.text, 600);
    return captcha.data;
  },

  sendCode: async (phone, captcha, type, key, randomCode) => {
    // ==============> 方案1
    // 60s重复获取的限制
    // if (await redisConfig.exists(`${type}:over:` + phone)) {
    //   return {
    //     code: -1,
    //     msg: "请60s后再试",
    //   };
    // }

    // ==============> 方案2
    if (await redisConfig.exists(`${type}:code:` + phone)) {
      let dateRedis = dayjs(
        (await redisConfig.get(`${type}:code:` + phone)).split("_")[0]
      );
      if (dayjs(Date.now()).diff(dateRedis, "second") <= 60) {
        return BackCode.buildResult(CodeEnum.CODE_LIMITED);
      }
    }

    // 判断图形验证码是否存在
    if (!(await redisConfig.exists(`${type}:captcha:` + key))) {
      return BackCode.buildError({ msg: "请发送图形验证码" });
    }

    // 对比图形验证码与redis中的是否一致
    let captchaRes = await redisConfig.get(`${type}:captcha:` + key);
    if (captcha.toLowerCase() !== captchaRes.toLowerCase()) {
      return BackCode.buildError({ msg: "图形验证码错误" });
    }

    // 阿里云发送手机验证码
    let codeRes = (await aliyunMessage(phone, randomCode)).data;

    // ==============> 方案1

    // // 存储到redis，设置有效期10min
    // redisConfig.set(`${type}:code:` + phone, randomCode, 600);

    // // 存60s，判断key值，过了之后才可以调取接口
    // redisConfig.set(`${type}:over:` + phone, "1", 60);

    // ==============> 方案2
    // 获取当前时间拼接验证码
    let randomCodeTime = `${Date.now()}_${randomCode}`;
    redisConfig.set(`${type}:code:` + phone, randomCodeTime, 600);

    // 获取到手机验证码，删除上次的图形验证码
    redisConfig.del(`${type}:captcha:` + key);
    if (codeRes.code === 200) {
      return BackCode.buildSuccessAndMsg({ msg: "发送成功" });
    } else {
      return BackCode.buildError({ msg: "发送失败" });
    }
  },
};

module.exports = NotifyService;
