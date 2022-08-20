var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url = "mongodb://127.0.0.1:27017"; // connection URL
const client = new MongoClient(url, { useUnifiedTopology: true}); // mongodb client
const dbName = "mydatabase"; // database name
const collectionName = "mountain"; // collection name

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("direction", { title: "Route zu Gebirge" });
});

module.exports = router;