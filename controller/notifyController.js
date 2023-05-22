const NotifyService = require("../service/notifyService");

const NotifyController = {
  captcha: async (req, res) => {
    let handleRes = await NotifyService.captcha();
    res.set("Content-Type", "image/svg+xml");
    res.send(handleRes);
  },
};

module.exports = NotifyController;
