var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const gjv = require("geojson-validation");
const fs = require("fs");
const axios = require("axios");

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

    const description = getWikiSnippet(mountain.properties.url);
    mountain.properties.description = description;


    // connect to the mongodb database and afterwards, insert one the new element
    client.connect(function (err) {
      //assert.equal(null, err);

      console.log("Connected successfully to server");
      console.log("A new Mountain has been added");
      console.log(mountain);

      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      // Insert the document in the database
      collection.insertOne(mountain, function (err, result) {
        //assert.equal(err, null);
        //assert.equal(1, result.result.ok);
        console.log(
          `Inserted ${result.insertedCount} document into the collection`);
        res.render("notification", { title: "Gebirge hinzugefügt!", data: JSON.stringify(mountain) });
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

      // connect to the mongodb database and afterwards, insert one the new element
      client.connect(function (err) {
        //assert.equal(null, err);

        console.log("Connected successfully to server");
        console.log("A new Mountain has been added");
        console.log(mountain);

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Insert the document in the database
        collection.insertOne(mountain, function (err, result) {
          //assert.equal(err, null);
          //assert.equal(1, result.result.ok);
          console.log(
            `Inserted ${result.insertedCount} document into the collection`);
          res.render("notification", { title: "Gebirge hinzugefügt!", data: JSON.stringify(mountain) });
        });
      });
    }
  });
});



// added Mountain through Leaflet
router.post("/new_mountain_leaflet", function (req, res, next) {
  if (req.body.mountain == "" || req.body.altitude == "" || req.body.long == "" || req.body.lat == "") {
    res.render("notification", {
      title: "Gebirge konnte nicht hinzugefügt werden. Überprüfe Eingabe!",
    });
  } else {

    const description = getWikiSnippet(req.body.url);

    let mountain = {
      "type": "Feature",
      "properties": {
        "shape": "Marker",
        "name": req.body.mountain,
        "altitude": req.body.altitude,
        "url": req.body.url,
        "description": description
      },
      "geometry": {
        "type": "Point",
        "coordinates": [req.body.long, req.body.lat]
      },
    };

    // connect to the mongodb database and afterwards, insert one the new element
    client.connect(function (err) {
      //assert.equal(null, err);

      console.log("Connected successfully to server");
      console.log("A new Mountain has been added");
      console.log(mountain);

      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      // Insert the document in the database
      collection.insertOne(mountain, function (err, result) {
        //assert.equal(err, null);
        //assert.equal(1, result.result.ok);
        console.log(
          `Inserted ${result.insertedCount} document into the collection`);
        res.render("notification", { title: "Gebirge hinzugefügt!", data: JSON.stringify(mountain) });
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
  if (file.name == "" || file.altitude == "" || file.url == "") {
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

/**
 * if url is valide and a wikipedia-url
 * then returns the snippet from Wikipedia with the WikipediaAPI
 * otherwise returns "Keine Informationen verfügbar"
 * @param {*} url 
 * @returns description
 */
function getWikiSnippet(url) {
  let description = "";
  if (!isValidUrl(url) || url.indexOf("wikipedia") === -1) {
    description = "Keine Informationen verfügbar";
    console.log("not valid: " + description);
    return description;
  } else {
    let urlArray = url.split("/");
    let title = urlArray[urlArray.length - 1];
    axios.get(
      "https://de.wikipedia.org/w/api.php?format=json&exintro=1&action=query&prop=extracts&explaintext=1&exsentences=1&origin=*&titles=" + title
    )
      .then(function (response) {
        const pageKey = Object.keys(response.data.query.pages)[0];
        const result = "\"" + response.data.query.pages[pageKey].extract + "\"";
        console.log("valid: " + result);
        return result;
      });
  }
}


/**
 * Validation of URLs
 * https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
 * @param {*} string 
 * @returns 
 */
function isValidUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

module.exports = router;
