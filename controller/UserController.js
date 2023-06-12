const UserService = require("../service/UserService");

const UserController = {
  register: async (req, res) => {
    let { phone, code } = req.body;
    console.log("phone:", phone);
    console.log("code:", code);
    let handleRes = await UserService.register(phone, code);
    res.send(handleRes);
  },
};

module.exports = UserController;
