//Inputs
var long = document.getElementById("long");
var lat = document.getElementById("lat");
console.log(long);

//Leaflet
var map = L.map("map").setView([51.96, 7.62], 13);

L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// draw Control
var drawControlEditTrue = new L.Control.Draw({
  draw: {
    polyline: false,
    rectangle: false,
    circle: false,
    circlemarker: false,
    polygon: false,
  },
  edit: {
    edit: false,
    remove: false,
    featureGroup: drawnItems,
  },
});
map.addControl(drawControlEditTrue);

var drawControlEditFalse = new L.Control.Draw({
  draw: false,
  edit: {
    edit: false,
    remove: true,
    featureGroup: drawnItems,
  },
});

// draw Event
map.on(L.Draw.Event.CREATED, function (e) {
  var layer = e.layer;
  drawnItems.addLayer(layer);
  var draws = drawnItems.toGeoJSON();
  long.value = draws.features[0].geometry.coordinates[0];
  lat.value = draws.features[0].geometry.coordinates[1];
  map.removeControl(drawControlEditTrue);
  map.addControl(drawControlEditFalse);
});

map.on("draw:deleted", function (e) {
  map.removeControl(drawControlEditFalse);
  map.addControl(drawControlEditTrue);
});
