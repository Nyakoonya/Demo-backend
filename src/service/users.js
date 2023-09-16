const { querySql, queryOne } = require("../utils/index.js");
const { md5, decodeAes } = require("../utils/md5.js");

const jwt = require("jsonwebtoken");
const boom = require("boom");
const { body, validationResult } = require("express-validator");
const {
  CODE_ERROR,
  CODE_SUCCESS,
  PRIVATE_KEY,
  JWT_EXPIRED,
} = require("../utils/constant.js");
const { decode } = require("../utils/user-jwt.js");
const db = require("../models");
const User = db.user;

function login(req, res, next) {
  const err = validationResult(req);
  console.log("err login", err);
  if (err.isEmpty()) {
    console.log("right------>>");

    let { username, password } = req.body;
    // decode pwd from frontend
    password = decodeAes(password);
    console.log("password after aes", password);
    // encode with md5
    password = md5(password);
    console.log("password after md5", password);

    User.findAll({
      where: {
        username,
        password,
      },
    }).then((result) => {
      // console.log("result---->>login", result[0].dataValues);
      if (result.length > 0) {
        const user = result[0].dataValues;
        //  preserve userid
        global.userId = user.id || "a861b242-1f51-11ee-a44a-70bb57828822";
        // login success and sign a token for frontend
        const token = jwt.sign({ username }, PRIVATE_KEY, {
          expiresIn: JWT_EXPIRED,
        });
        let userData = {
          id: user.id,
          username: user.username,
        };
        res.json({
          code: CODE_SUCCESS,
          msg: "login successful!",
          data: {
            token,
            userData,
          },
        });
      } else {
        res.json({
          code: CODE_ERROR,
          msg: "Wrong user name or password!",
          data: null,
        });
      }
    });
    // const query = `select * from Users where username=${username} and password=${password}`;
    // querySql(query).then((user) => {
    //   console.log("user", user);
    //   if (user && user.length > 0) {
    //     //  preserve userid
    //     global.userId = user[0].id || "a861b242-1f51-11ee-a44a-70bb57828822";
    //     // login success and sign a token for frontend
    //     const token = jwt.sign({ username }, PRIVATE_KEY, {
    //       expiresIn: JWT_EXPIRED,
    //     });
    //     let userData = {
    //       id: user[0].id,
    //       username: user[0].username,
    //       gmt_create: user[0].gmt_create,
    //       gmt_modify: user[0].gmt_modify,
    //     };
    //     res.json({
    //       code: CODE_SUCCESS,
    //       msg: "login successful!",
    //       data: {
    //         token,
    //         userData,
    //       },
    //     });
    //   } else {
    //     res.json({
    //       code: CODE_ERROR,
    //       msg: "Wrong user name or password!",
    //       data: null,
    //     });
    //   }
    // });
  } else {
    //  error exist
    console.log("fail");
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  }
}

module.exports = {
  login,
};
