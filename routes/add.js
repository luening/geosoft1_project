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

//global attribute
let description = "";


//GET home page
router.get("/", function (req, res, next) {
  res.render("add", { title: "Gebirge hinzufügen" });
});


// added Mountain through textfield
router.post("/new_mountain_textfield", function (req, res, next) {

  // try parsing of input text
  try {
    JSON.parse(req.body.textfield);
  }
  catch (err) {
    res.render("notification", {
      title: "Gebirge konnte nicht hinzugefügt werden. Überprüfe GeoJSON-Syntax!",
    });
  }
  let mountain = JSON.parse(req.body.textfield);

  if (validateFormat(mountain, res)) {

    getWikiSnippet(mountain.properties.url);

    //waits for getWikiSnippet to resolve promise
    setTimeout(function () {
      mountain.properties.description = description;

      // connect to the mongodb database and afterwards, insert one the new element
      client.connect(function (err) {

        console.log("Connected successfully to server");
        console.log("A new Mountain has been added");
        console.log(mountain);

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Insert the document in the database
        collection.insertOne(mountain, function (err, result) {
          console.log(
            `Inserted ${result.insertedCount} document into the collection`);
          res.render("notification", { title: "Gebirge hinzugefügt!", data: JSON.stringify(mountain) });
        });
      });
    }, 1500);
  }
});


// added Mountain through fileupload
router.post("/new_mountain_file", function (req, res, next) {

  fs.readFile(req.body.file, "utf8", function (err, data) {

    // try parsing of input text
    try {
      JSON.parse(data);
    }
    catch (err) {
      res.render("notification", {
        title: "Gebirge konnte nicht hinzugefügt werden. Überprüfe GeoJSON-Syntax!",
      });
    }
    let mountain = JSON.parse(data);

    if (validateFormat(mountain, res)) {

      getWikiSnippet(mountain.properties.url);

      //waits for getWikiSnippet to resolve promise
      setTimeout(function () {
        mountain.properties.description = description;

        // connect to the mongodb database
        client.connect(function (err) {

          console.log("Connected successfully to server");
          console.log("A new Mountain has been added");
          console.log(mountain);

          const db = client.db(dbName);
          const collection = db.collection(collectionName);

          // Insert the document in the database
          collection.insertOne(mountain, function (err, result) {
            console.log(
              `Inserted ${result.insertedCount} document into the collection`);
            res.render("notification", { title: "Gebirge hinzugefügt!", data: JSON.stringify(mountain) });
          });
        });
      }, 1500);
    }
  });
});


// added Mountain through Leaflet
router.post("/new_mountain_leaflet", function (req, res, next) {

  //Checks if input is correct
  if (req.body.mountain == "" || req.body.altitude == "" || req.body.long == "" || req.body.lat == "") {
    res.render("notification", {
      title: "Gebirge konnte nicht hinzugefügt werden. Überprüfe Eingabe!",
    });
  } else {

    getWikiSnippet(req.body.url);

    //waits for getWikiSnippet to resolve promise
    setTimeout(function () {

      //Feature Mountain
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

        console.log("Connected successfully to server");
        console.log("A new Mountain has been added");
        console.log(mountain);

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Insert the document in the database
        collection.insertOne(mountain, function (err, result) {
          console.log(
            `Inserted ${result.insertedCount} document into the collection`);
          res.render("notification", { 
            title: "Gebirge hinzugefügt!", 
            data: JSON.stringify(mountain) });
        });
      });
    }, 1500);
  };
});


/**
 * Validates the parameters of the geojson file
 * @param {*} file 
 * @returns 
 */
function validateFormat(geojson, res) {

  //Properties
  if (geojson.properties == null) {
    res.render("notification", {
      title: "Gebirge konnte nicht hinzugefügt werden. Überprüfe Angabe von Properties!",
    });
    return false;
    //Name
  } else if (geojson.properties.name == null || geojson.properties.name == "") {
    res.render("notification", {
      title: "Gebirge konnte nicht hinzugefügt werden. Überprüfe Attribut Name!",
    });
    return false;
    //Altitude
  } else if (geojson.properties.altitude == null || geojson.properties.altitude == "") {
    res.render("notification", {
      title: "Gebirge konnte nicht hinzugefügt werden. Überprüfe Attribut Höhe!",
    });
    return false;
    // url
  } else if (geojson.properties.url == null || geojson.properties.url == "") {
    res.render("notification", {
      title: "Gebirge konnte nicht hinzugefügt werden. Überprüfe Attribut URL!",
    });
    return false;
    //description
  } else if (geojson.properties.description == null || geojson.properties.description != "") {
    res.render("notification", {
      title: "Gebirge konnte nicht hinzugefügt werden. Überprüfe Attribut Beschreibung!",
    });
    return false;
    //geometry
  } else if (geojson.geometry == null) {
    res.render("notification", {
      title: "Gebirge konnte nicht hinzugefügt werden. Überprüfe Angabe von Koordinaten!",
    });
    return false;
    //coordinates
  } else if (geojson.geometry.coordinates[0] == null || geojson.geometry.coordinates[1] == null || geojson.geometry.coordinates[0] == "" || geojson.geometry.coordinates[1] == "") {
    res.render("notification", {
      title: "Gebirge konnte nicht hinzugefügt werden. Überprüfe Koordinaten!",
    });
    return false;

  } else {
    return true;
  }
};


/**
 * if url is valide and a wikipedia-url
 * then sets @param description to the snippet from Wikipedia with the WikipediaAPI
 * otherwise sets @param description to "Keine Informationen verfügbar"
 * @param {*} url 
 */
function getWikiSnippet(url) {

  if (!isValidUrl(url) || url.indexOf("wikipedia") === -1) {

    description = "Keine Informationen verfügbar";

  } else {

    let urlArray = url.split("/");
    let title = urlArray[urlArray.length - 1];

    axios.get(
      "https://de.wikipedia.org/w/api.php?format=json&exintro=1&action=query&prop=extracts&explaintext=1&exsentences=1&origin=*&titles=" + title
    ).then(function (response) {
      const pageKey = Object.keys(response.data.query.pages)[0];
      description = response.data.query.pages[pageKey].extract;
    });
  }
}


/**
 * Validation of URLs
 * https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
 * @param {*} string 
 * @returns true for vaild url
 *          false for unvaild url
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
