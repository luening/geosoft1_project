//Leaflet
var map = L.map("map").setView([49.845363, 9.905964], 4);

L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var table = document.getElementById("table");
var markerArray = [];

//Marker & table
geojson.forEach((element) => {

  //marker
  var marker = new Array(2);
  marker[0] = L.marker([
    element.geometry.coordinates[1],
    element.geometry.coordinates[0],
  ]).addTo(map)
    .bindPopup(
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
  marker[1] = element._id;
  markerArray.push(marker);

  //table
  var tr = document.createElement('tr');
  tr.innerHTML = "<td>" + element._id + "</td><td>" + element.properties.name + "</td><td>" + element.properties.altitude + "</td><td>" + element.properties.url + "</td><td>" + element.properties.description + "</td>";
  tr.addEventListener("click", highlightMountain);
  table.appendChild(tr); // appends to the tbody element
});

/**
 * function to highlight clicked mountains in table. Zooms and open ups the popup.
 * @param {*} e 
 */
function highlightMountain(e) {
  let id = e.target.parentNode.firstChild.firstChild.data;

  //zoom
  let mountain = geojson.find((element) => element._id == id);
  map.setView([mountain.geometry.coordinates[1], mountain.geometry.coordinates[0]], 5);

  //open Popup
  let marker = markerArray.find((element) => element[1] == id);
  marker[0].openPopup();
}
