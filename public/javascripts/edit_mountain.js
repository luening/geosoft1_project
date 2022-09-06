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
    marker.on("click", onClick);
});

/**
 * Event Listener for choosing a marker on the map to fill out the inputs
 * @param {*} e 
 */
function onClick(e) {
    let mountain = geojson.find((element) => 
        element.geometry.coordinates[0] == e.target._latlng.lng || 
        element.geometry.coordinates[1] == e.target._latlng.lat);

    document.getElementById("id").value = mountain._id;
    document.getElementById("mountain").value = mountain.properties.name;
    document.getElementById("altitude").value = mountain.properties.altitude;
    document.getElementById("url").value = mountain.properties.url;
    document.getElementById("long").value = mountain.geometry.coordinates[0];
    document.getElementById("lat").value = mountain.geometry.coordinates[1];
}