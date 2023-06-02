const md5 = require("blueimp-md5");
const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require("../config/jwtSecretKey");

class SecretTool {
  static md5(query) {
    return md5(query);
  }
  static jwtSign(query, time) {
    return jwt.sign(query, jwtSecretKey, {
      expiresIn: time,
    });
  }
  static jwtVerify(query) {
    return jwt.verify(query, jwtSecretKey);
  }
}

module.exports = SecretTool;
