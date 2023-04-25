const { Sequelize } = require("sequelize");
const initModels = require("../models/init-models");

const sequelize = new Sequelize("xiaodi_edu", "root", "Pass_123", {
  host: "49.234.9.51",
  dialect: "mysql",
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("连接成功");
  } catch (error) {
    console.log("连接失败");
  }
})();

const models = initModels(sequelize);

module.exports = {
  ...models,
  sequelize,
};
