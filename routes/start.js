var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("start", { title: "Startseite" });
});

module.exports = router;