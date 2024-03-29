const redisConfig = require("../config/redisConfig");
const DB = require("../config/sequelize");
const RandomTool = require("../utils/RandomTool");
const BackCode = require("../utils/BackCode");
const SecretTool = require("../utils/SecretTool");
const CodeEnum = require("../utils/CodeEnum");

const UserService = {
  register: async (phone, code) => {
    // 手机号注册查重
    let existPhone = await DB.Account.findAll({ where: { phone } });
    if (existPhone.length > 0) {
      return BackCode.buildResult(CodeEnum.ACCOUNT_REPEAT);
    }
    // 获取redis中的验证码和用户传入的对比
    if (await redisConfig.exists("register:code:" + phone)) {
      let codeRes = (await redisConfig.get("register:code:" + phone)).split(
        "_"
      )[1];
      if (code !== codeRes) {
        return BackCode.buildError({ msg: "短信验证码不正确" });
      }
    } else {
      return BackCode.buildError({ msg: "请先获取验证码" });
    }

    // 获取随机头像
    let avatar = RandomTool.randomAvatar();
    let name = RandomTool.randomName();

    // 生成token 7天
    let user = { avatar, name, phone };
    let token = SecretTool.jwtSign(user, "168h");
    // 将用户信息插入到数据库
    await DB.Account.create({
      username: name,
      head_img: avatar,
      phone,
    });
    return BackCode.buildSuccessAndData({ data: `Bearer ${token}` });
  },
  forget: async (req) => {
    let { phone, password, code } = req.body;
    // 获取redis中的验证码和用户传入的对比
    // if (await redisConfig.exists("forget:code:" + phone)) {
    let codeExist = await redisConfig.exists("change:code:" + phone);
    if (!codeExist) {
      return BackCode.buildError({ msg: "请先获取验证码" });
    }
    // }
    // 判断redis中的验证码和用户传入的是否一致
    let codeRes = (await redisConfig.get("change:code:" + phone)).split("_")[1];
    if (code !== codeRes) {
      return BackCode.buildError({ msg: "短信验证码不正确" });
    }

    // 修改密码
    pwd = SecretTool.md5(password);

    await DB.Account.update(
      { pwd },
      {
        where: {
          phone,
        },
      }
    );
    return BackCode.buildSuccessAndMsg({ msg: "修改成功" });
  },
  login: async (req) => {
    // 参数判空
    let { phone, password, code } = req.body;
    if (!phone || (!password && !code)) {
      return BackCode.buildError({ msg: "参数错误" });
    }
    // 判断手机号是否注册过
    let userInfo = await DB.Account.findAll({ where: { phone }, raw: true });
    if (userInfo.length === 0) {
      return BackCode.buildResult(CodeEnum.ACCOUNT_UNREGISTER);
    }

    if (password) {
      // 判断密码是否正确
      if (SecretTool.md5(password) !== userInfo[0].pwd) {
        return BackCode.buildResult(CodeEnum.ACCOUNT_PWD_ERROR);
      }
    } else {
      // 获取redis中的验证码和用户传入的对比
      if (await redisConfig.exists("login:code:" + phone)) {
        let codeRes = (await redisConfig.get("login:code:" + phone)).split(
          "_"
        )[1];
        if (code !== codeRes) {
          return BackCode.buildError({ msg: "短信验证码不正确" });
        }
      } else {
        return BackCode.buildError({ msg: "请先获取验证码" });
      }
    }

    // 拼接token的用户信息，除去密码
    let user = { ...userInfo[0], pwd: "" };
    // 生成token 7天
    let token = SecretTool.jwtSign(user, "168h");
    return BackCode.buildSuccessAndData({ data: `Bearer ${token}` });
  },
};

module.exports = UserService;
