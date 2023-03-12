const md5 = require("blueimp-md5");
const jwt = require("jsonwebtoken");
const { jwtSecretKye } = require("../config/jwtSecretKye");

class SecretTool {
  static md5(query) {
    return md5(query);
  }
  static jwtSign(query, time) {
    return jwt.sign(query, jwtSecretKye, {
      expiresIn: time,
    });
  }
  static jwtVerify(query) {
    return jwt.verify(query, jwtSecretKye);
  }
}

module.exports = SecretTool;
