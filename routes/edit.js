var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url = "mongodb://localhost:27017"; // connection URL
const client = new MongoClient(url, { useUnifiedTopology: true}); // mongodb client
const dbName = "mydatabase"; // database name
const collectionName = "mountain"; // collection name

/* GET home page. */
router.get("/", function (req, res, next) {
  // connect to the mongodb database and retrieve all docs
  client.connect(function (err) {
    assert.equal(null, err);

    console.log('Connected successfully to server');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    collection.find({}).toArray(function (err, docs) {
      assert.equal(err, null);
      console.log('Found the following records...');
      res.render('edit', { title: 'Gebirge bearbeiten', data: docs });

    })

  })
});


router.post("/delete_mountain", function (req, res, next) {

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
        console.log("Mountain deleted!");
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
