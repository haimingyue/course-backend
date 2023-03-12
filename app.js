const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { expressjwt: jwt } = require("express-jwt");
const { jwtSecretKey } = require("./config/jwtSecretKye");

app.use(cors());

// 解析json格式的数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  jwt({
    secret: jwtSecretKey,
    algorithms: ["HS256"],
  }).unless({
    path: [/^\/api\/user\/v1\/register/, /^\/api\/user\/v1\/login/],
  })
);

app.get("/test", (req, res) => {
  res.send("小滴课堂");
});

// 错误中间件
app.use((err, req, res, next) => {
  // 未登录的错误
  if (err.name === "UnauthorizedError") {
    return res.send({
      code: -1,
      data: null,
      msg: "请先登录",
    });
  }
  // 其他的错误
  res.send({
    code: -1,
    data: null,
    msg: err.message,
  });
});

app.listen("8081", () => {
  console.log("服务器运行在：8081端口");
});
