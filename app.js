var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var startRouter = require("./routes/start");
var addRouter = require("./routes/add");
var showRouter = require("./routes/show");
var editRouter = require("./routes/edit");
var directionRouter = require("./routes/direction");
var impressumRouter = require("./routes/impressum");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use("/", startRouter);
app.use("/add", addRouter);
app.use("/show", showRouter);
app.use("/edit", editRouter);
app.use("/direction", directionRouter);
app.use("/impressum", impressumRouter);

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

module.exports = app;
