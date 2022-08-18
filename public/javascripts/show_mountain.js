//Leaflet
var map = L.map("map").setView([51.96, 7.62], 13);

L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

//Marker
geojson.forEach((element) => {
  var marker = L.marker([
    element.geometry.coordinates[1],
    element.geometry.coordinates[0],
  ]).addTo(map);
  marker.bindPopup(element.properties.name).openPopup();
});
