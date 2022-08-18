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
  res.render("add", { title: "Gebirge hinzufügen" });
});

router.post("/add/newMountain", function (req, res, next) {
  if (req.body.poiname == "" || req.body.long == "" || req.body.lat == "") {
    res.render("notification", {
      title: "Gebirge konnte nicht hinzugefügt werden. Überprüfe Eingabe!",
    });
  }else {
    console.log("A new Mountain has been added");

    let poi = {
      type: "Feature",
      properties: {
        shape: "Marker",
        name: req.body.poiname,
        category: "default",
      },
      geometry: {
        type: "Point",
        coordinates: [req.body.long, req.body.lat],
      },
    };

    console.log(poi);

    // connect to the mongodb database and afterwards, insert one the new element
    client.connect(function (err) {
      //assert.equal(null, err);

      console.log("Connected successfully to server");

      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      // Insert the document in the database
      collection.insertOne(poi, function (err, result) {
        //assert.equal(err, null);
        //assert.equal(1, result.result.ok);
        console.log(
          `Inserted ${result.insertedCount} document into the collection`);
        res.render("notification", { title: "PoI hinzugefügt!" });
      });
    });
  };
});

module.exports = router;
