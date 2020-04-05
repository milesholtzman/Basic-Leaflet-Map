var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
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
  "Grayscale": grayscale,
  "Dark Map": darkmap
};


function markerSize(magnitude) {
  return magnitude * 10000;
};

function getColor(magnitude) {
    return magnitude < 1 ? '#4AE564' :
           magnitude < 2 ? '#BBE54A' :
           magnitude < 3 ? '#E5E34A' :
           magnitude < 4 ? '#E5C24A' :
           magnitude < 5 ? '#E5904A' :
           '#E55D4A' ;
         };

d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson', function(response) {
  // console.log(response)
  response.features.forEach(element => {
    quakeMarkers =
      L.circle([(element.geometry.coordinates[1]), (element.geometry.coordinates[0])], {
        stroke: false,
        fillOpacity: 0.6,
        color: getColor(element.properties.mag),
        fillColor: getColor(element.properties.mag),
        radius: markerSize(element.properties.mag)
      }).addTo(myMap)
  })
})

var quakes = L.layerGroup(quakeMarkers);

var overlayMaps = {
  "Earthquakes": quakes
};

// Define a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4,
  layers: [grayscale, quakes]
});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);