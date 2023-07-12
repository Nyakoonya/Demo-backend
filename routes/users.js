const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const service = require("../service/users");

// check login params
const validator = [
  body("username").isString().withMessage("Username type is wrong"),
  body("password").isString().withMessage("Password type is wrong"),
];
// login
router.post("/login", validator, service.login);

module.exports = router;
