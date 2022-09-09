//coordinates origin and destination
var longLocation = document.getElementById("longLocation");
var latLocation = document.getElementById("latLocation");
var longDestination = document.getElementById("long");
var latDestination = document.getElementById("lat");

//buttons location and route
let locationButton = document.getElementById("location");
locationButton.addEventListener("click", getLocation);
let routeButton = document.getElementById("route");
routeButton.addEventListener("click", routeBerechnen);


//Leaflet
var map = L.map("map").setView([49.845363, 9.905964], 4);

L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);


//add mountains to map
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

geojson.forEach((element) => {
  var marker = L.marker([
    element.geometry.coordinates[1],
    element.geometry.coordinates[0],
  ])
  marker.addTo(map)
  marker.on("click", onClick);
});


//Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiYndhZGFtc29uIiwiYSI6ImNqajZhNm1idDFzMjIza3A2Y3ZmdDV6YWYifQ.9NhptR7a9D0hzWXR51y_9w';
var mapbox = new mapboxgl.Map({
  container: 'mapRoute',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [9.905964, 49.845363],
  zoom: 3
});


/**
 * calculate route from location to picked mountain
 */
function routeBerechnen() {
  var directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken
  });
  mapbox.addControl(directions, 'top-left');

  directions.setOrigin([longLocation.value, latLocation.value]);
  directions.setDestination([longDestination.value, latDestination.value]);
};


/**
 * Event Listener for choosing a marker on the map to fill out the inputs
 * @param {*} e 
 */
 function onClick(e) {
  let mountain = geojson.find((element) => 
      element.geometry.coordinates[0] == e.target._latlng.lng || 
      element.geometry.coordinates[1] == e.target._latlng.lat);

  //fillout inputs
  document.getElementById("mountain").value = mountain.properties.name;
  longDestination.value = mountain.geometry.coordinates[0];
  latDestination.value = mountain.geometry.coordinates[1];
}


/**
 * get the Location of the user
 */
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      longLocation.value = position.coords.longitude;
      latLocation.value = position.coords.latitude;
    })
  }
};