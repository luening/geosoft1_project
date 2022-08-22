var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const gjv = require("geojson-validation");
const fs = require("fs");

const url = "mongodb://127.0.0.1:27017"; // connection URL
const client = new MongoClient(url, { useUnifiedTopology: true }); // mongodb client
const dbName = "mydatabase"; // database name
const collectionName = "mountain"; // collection name

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("add", { title: "Gebirge hinzufügen" });
});


// added Mountain through textfield
router.post("/new_mountain_textfield", function (req, res, next) {
  mountain = JSON.parse(req.body.textfield);
  if (validateGeoJSON(mountain, res)) {
    console.log("A new Mountain has been added");
    console.log(mountain);

    // connect to the mongodb database and afterwards, insert one the new element
    client.connect(function (err) {
      //assert.equal(null, err);

      console.log("Connected successfully to server");

      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      // Insert the document in the database
      collection.insertOne(mountain, function (err, result) {
        //assert.equal(err, null);
        //assert.equal(1, result.result.ok);
        console.log(
          `Inserted ${result.insertedCount} document into the collection`);
        res.render("notification", { title: "Gebirge hinzugefügt!" });
      });
    });
  }
});



// added Mountain through fileupload
router.post("/new_mountain_file", function (req, res, next) {

  fs.readFile(req.body.file, "utf8", function (err, data) {
    const mountain = JSON.parse(data);
    if (validateGeoJSON(mountain, res)) {

      const description = getWikiSnippet(mountain.properties.url);
      mountain.properties.description = description;
      
      console.log("A new Mountain has been added");
      console.log(mountain);

      // connect to the mongodb database and afterwards, insert one the new element
      client.connect(function (err) {
        //assert.equal(null, err);

        console.log("Connected successfully to server");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Insert the document in the database
        collection.insertOne(mountain, function (err, result) {
          //assert.equal(err, null);
          //assert.equal(1, result.result.ok);
          console.log(
            `Inserted ${result.insertedCount} document into the collection`);
          res.render("notification", { title: "Gebirge hinzugefügt!" });
        });
      });
    }
  });
});



// added Mountain through Leaflet
router.post("/new_mountain_leaflet", function (req, res, next) {
  if (req.body.mountain == "" || req.body.height == "" || req.body.long == "" || req.body.lat == "") {
    res.render("notification", {
      title: "Gebirge konnte nicht hinzugefügt werden. Überprüfe Eingabe!",
    });
  } else {
    console.log("A new Mountain has been added");

    const description = getWikiSnippet(req.body.url);

    let mountain = {
      "type": "Feature",
      "properties": {
        "shape": "Marker",
        "name": req.body.mountain,
        "height": req.body.height,
        "url": req.body.url,
        "description": description,
      },
      "geometry": {
        "type": "Point",
        "coordinates": [req.body.long, req.body.lat],
      },
    };

    console.log(mountain);

    // connect to the mongodb database and afterwards, insert one the new element
    client.connect(function (err) {
      //assert.equal(null, err);

      console.log("Connected successfully to server");

      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      // Insert the document in the database
      collection.insertOne(mountain, function (err, result) {
        //assert.equal(err, null);
        //assert.equal(1, result.result.ok);
        console.log(
          `Inserted ${result.insertedCount} document into the collection`);
        res.render("notification", { title: "Gebirge hinzugefügt!" });
      });
    });
  };
});


/**
 * Validation of GeoJSON Files
 * @param {*} file 
 * @returns 
 */
function validateGeoJSON(file, res) {
  if (file.name == "" || file.height == "" || file.url == "") {
    res.render("notification", {
      title: "Gebirge konnte nicht hinzugefügt werden. Überprüfe Eingabe!",
    });
    return false;
  }
  if (!gjv.valid(file)) {
    res.render("notification", {
      title: "Gebirge konnte nicht hinzugefügt werden. Überprüfe GeoJSON-Syntax!",
    });
    return false;
  }
  return true;
};

function getWikiSnippet(wikiURL){
  const url = ""
  fetch("url")
        .then(response => response.json())
        .then(data => {
            const busstationArray = generateBusstations(data.features);
            const busstationsDistance = distance(point, busstationArray);
            markBusstations(busstationsDistance);
        })
}

module.exports = router;
