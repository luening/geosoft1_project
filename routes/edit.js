var express = require("express");
var router = express.Router();

const MongoClient = require("mongodb").MongoClient;

var mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const axios = require("axios");

const url = "mongodb://127.0.0.1:27017"; // connection URL
const client = new MongoClient(url, { useUnifiedTopology: true }); // mongodb client
const dbName = "mydatabase"; // database name
const collectionName = "mountain"; // collection name

//global attribute
let description = "";

//GET home page
router.get("/", function (req, res, next) {
  // connect to the mongodb database
  client.connect(function (err) {

    console.log('Connected successfully to server');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    //retrieve all docs and show them on leaflet map
    collection.find({}).toArray(function (err, docs) {
      console.log('Found the following records...');
      res.render('edit', { title: 'Gebirge bearbeiten', data: docs });

    })

  })
});

//delete picked mountain 
router.post("/delete_mountain", function (req, res, next) {

  var mountainID = req.body.id;

  //checks if a mountain has been picked 
  if (mountainID == "") {
    res.render("notification", {
      title: "Gebirge konnte nicht gelöscht werden. Zuerst Gebirge in Karte auswählen.",
    });
  } else {

    // connect to the mongodb database
    client.connect(function (err) {
      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      //checks if id exists
      collection.find({ _id: ObjectId(mountainID) }).toArray(function (err, docs) {

        if (docs.length >= 1) {
          //if the mountain exists and is not in use
          collection.deleteOne({ _id: ObjectId(mountainID) }, function (err, results) {
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
  }
});

//update picked mountain with changed attributes from inputs
router.post("/update_mountain", function (req, res, next) {

  var mountainID = req.body.id;
  
  //checks if a mountain has been picked
  if (mountainID == "") {
    res.render("notification", {
      title: "Gebirge konnte nicht aktualisiert werden. Zuerst Gebirge in Karte auswählen.",
    });
  } else {

    getWikiSnippet(req.body.url);

    //waits for getWikiSnippet to resolve promise
    setTimeout(function () {
      // connect to the mongodb database
      client.connect(function (err) {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        //checks if id exists
        collection.find({ _id: ObjectId(mountainID) }).toArray(function (err, docs) {
          if (docs.length >= 1) {

            //updates mountain with attributes from inputs
            collection.updateOne({ _id: ObjectId(mountainID) },
              {
                $set: {
                  properties: {
                    name: req.body.mountain,
                    altitude: req.body.altitude,
                    url: req.body.url,
                    description: description,
                  },
                  geometry: {
                    coordinates: [req.body.long, req.body.lat],
                  },
                }
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
    }, 1500);
  }
});


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
