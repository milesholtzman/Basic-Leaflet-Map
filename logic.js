var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

var quakeMarkers = [];

var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};


function markerSize(magnitude) {
  return magnitude * 100;
}

d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson', function(response) {

  for (var i = 0; i < response.length; i++) {
  quakeMarkers.push(
    L.circle([(response[i].features[0].geometry.coordinates[1]), (response[i].features[0].geometry.coordinates[0])], {
      stroke: false,
      fillOpacity: 0.75,
      color: "red",
      fillColor: "red",
      radius: markerSize(response.features[1].properties.mag)
    })
  );
}})

var quakes = L.layerGroup(quakeMarkers);

var overlayMaps = {
  "Earthquakes": quakes
};

console.log(quakeMarkers);

// Define a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4,
  layers: [darkmap, quakes]
});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);