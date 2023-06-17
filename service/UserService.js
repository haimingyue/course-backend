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
};

module.exports = UserService;
