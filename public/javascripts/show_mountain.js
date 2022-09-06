//Leaflet
var map = L.map("map").setView([49.845363, 9.905964], 4);

L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

//Marker
geojson.forEach((element) => {
  var marker = L.marker([
      element.geometry.coordinates[1],
      element.geometry.coordinates[0],
  ])
  marker.addTo(map)
  marker.bindPopup(
      "<table  class='table table-striped table-dark table-hover'>" +
      "  <tr>" +
      "    <th>Name</th>" +
      "    <td>" +
      element.properties.name +
      "</td>" +
      "  </tr>" +
      "  <tr>" +
      "    <th>Höhe</th>" +
      "    <td>" +
      element.properties.altitude +
      "</td>" +
      "  </tr>" +
      "  <tr>" +
      "    <th>Url</th>" +
      "    <td>" +
      element.properties.url +
      "</td>" +
      "  </tr>" +
      "  <tr>" +
      "    <th>Beschreibung</th>" +
      "    <td>" +
      element.properties.description +
      "</td>" +
      "  </tr>" +
      "</table>")
});
