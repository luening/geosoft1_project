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
  res.render("edit", { title: "Gebirge bearbeiten" });
});


//Post Location - this post operation can be used to store new locations in the locations collection
router.post("/search_mountain", function (req, res, next) {

  var mountain = req.body.mountain;
  console.log(mountain);
  //Check if Name exists
  client.connect(function (err) {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    collection.find({"properties.name": mountain}).toArray(function (err, docs) {
      if (docs.length >= 1) {
        //if the locations exists and is not in use
        req.body.altitude = docs[0].properties.altitude;
        req.body.url = docs[0].properties.url;
        req.body.long = docs[0].geometry.coordinates[0];
        req.body.lat = docs[0].geometry.coordinates[1];

      } else {
        //if the location does not exist
        res.render("notification", {
          title: "Gebirge nicht vorhanden. Überprüfe Eingabe!",
        });
      }
    });
  });
});



router.post("/delete_mountain", function (req, res, next) {
  console.log("Mountain deleted!");

  var mountain = req.body.mountain;

  //Check if Mountain exists
  client.connect(function (err) {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    collection.find({"properties.name": mountain}).toArray(function (err, docs) {
      if (docs.length >= 1) {
        //if the mountain exists and is not in use
        collection.deleteOne({"properties.name": mountain}, function (err, results) {
          //delete the mountain from the mountain collection
        });
        res.render("notification", {
          title: "Gebirge wurde gelöscht.",
        });
      } else {
        //if the mountain does not exist
        res.render("notification", {
          title: "Gebirge nicht vorhanden. Überprüfe Eingabe!",
        });
      }
    });
  });
});

router.post("/update_mountain", function (req, res, next) {
  console.log("Mountain updated!");

  var mountain = req.body.mountain;

  //Check if Name exists
  client.connect(function (err) {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    collection.find({"properties.name": mountain}).toArray(function (err, docs) {
      if (docs.length >= 1) {

        collection.updateOne({"properties.name": mountain},
            {
              name : req.body.mountain,
              altitude : req.body.altitude,
              url: req.body.url,
              coordinates:[req.body.long,req.body.lat]
            });
        res.render("notification", {
          title: "Gebirge wurde bearbeitet.",
        });
      } else {
        //if the mountain does not exist
        res.render("notification", {
          title: "Gebirge nicht vorhanden. Überprüfe Eingabe!",
        });
      }
    });
  });
});

module.exports = router;
