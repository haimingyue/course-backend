const md5 = require("blueimp-md5");
const jwt = require("jsonwebtoken");
const sha1 = require("sha1");
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

  static sha1(query) {
    return sha1(query);
  }
}

module.exports = SecretTool;
