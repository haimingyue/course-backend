const { parseString } = require("xml2js");
class WxDataTool {
  // 以流的形式处理微信的参数
  static getXMLStr(req) {
    return new Promise((resolve, reject) => {
      let xmlStr = "";
      req.on("data", (data) => {
        xmlStr += data.toString();
      });
      req.on("end", () => {
        resolve(xmlStr);
      });
    });
  }
  // 将XML转换为JSON
  static parseXMLToJson(xmlStr) {
    return new Promise((resolve, reject) => {
      parseString(xmlStr, { trim: true }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  // 将数据优化成普通对象
  static formatMessage(result) {
    let message = {};
    if (typeof result === "object") {
      let keys = Object.keys(result);
      for (let i = 0; i < keys.length; i++) {
        let item = result[keys[i]];
        let key = keys[i];
        if (!(item instanceof Array) || item.length === 0) {
          continue;
        }
        if (item.length === 1) {
          let val = item[0];
          if (typeof val === "object") {
            message[key] = formatMessage(val);
          } else {
            message[key] = (val || "").trim();
          }
        } else {
          message[key] = [];
          for (let j = 0; j < item.length; j++) {
            message[key].push(formatMessage(item[j]));
          }
        }
      }
    }
    return message;
  }
}

module.exports = WxDataTool;
