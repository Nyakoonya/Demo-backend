var express = require("express");
var fs = require("fs");

var router = express.Router();
var files = fs.readdirSync(__dirname);
const { jwtAuth, decode } = require("../utils/user-jwt"); // 引入jwt认证函数

router.use(jwtAuth); //注入认证模块
files
  .filter((file, i) => file !== "loader.js")
  .forEach((file, i) => {
    var route = require("./" + file.replace(".js", ""));
    if (file === "index.js") {
      router.use("/", route);
    } else {
      router.use("/api/" + file.replace(".js", ""), route);
    }
  });
// 自定义全局统一的异常处理中间件
router.use((err, req, res, next) => {
  // 自定义用户认证失败的错误返回
  console.log("err router 全局:>> ", err);
  if (err && err.name === "UnauthorizedError") {
    const { status = 401 } = err;
    // 抛出401异常
    res.status(status).json({
      code: status,
      msg: "Authorization expired, please login again!",
      data: null,
    });
  } else {
    const { output } = err || {};
    // 错误码和错误信息
    const errCode = (output && output.statusCode) || 500;
    const errMsg =
      (output && output.payload && output.payloa.error) || err.message;
    res.status(errCode).json({
      code: errCode,
      msg: errMsg,
    });
  }
});
module.exports = router;
