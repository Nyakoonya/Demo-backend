var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var http = require("http");
var debug = require("debug");
var bodyParser = require("body-parser");
const cors = require('cors'); // 跨域模块

var loader = require("./routes/loader");

var app = express();
var server = http.createServer(app);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); //注入cors模块解决跨域

// app.use("/", indexRouter);
// app.use("/users", usersRouter);
app.use("/", loader);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

server.listen(80, () => {
  console.log("server starts!");
  debug("Express server listening on port" + server.address().port);
});
// module.exports = app;
