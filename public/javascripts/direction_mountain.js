let locationButton = document.getElementById("location");
locationButton.addEventListener("click", getLocation);

//Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiYndhZGFtc29uIiwiYSI6ImNqajZhNm1idDFzMjIza3A2Y3ZmdDV6YWYifQ.9NhptR7a9D0hzWXR51y_9w';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [-79.4512, 43.6568],
  zoom: 13
});

map.on('load', function() {
  var directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken
  });
  map.addControl(directions, 'top-left');

  directions.setOrigin('Brockton Avenue, Toronto');
  directions.setDestination('East York Avenue, Toronto');
});

/*
geojson.forEach((element) => {
  var marker = L.marker([
    element.geometry.coordinates[1],
    element.geometry.coordinates[0],
  ])
  marker.addTo(map)
});
*/


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      document.getElementById("longLocation").value = position.coords.longitude;
      document.getElementById("latLocation").value = position.coords.latitude;
    })
  }
};