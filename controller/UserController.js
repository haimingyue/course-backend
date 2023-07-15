const UserService = require("../service/UserService");

const UserController = {
  register: async (req, res) => {
    let { phone, code } = req.body;
    let handleRes = await UserService.register(phone, code);
    res.send(handleRes);
  },
  forget: async (req, res) => {
    let handleRes = await UserService.forget(req);
    res.send(handleRes);
  },
};

module.exports = UserController;
