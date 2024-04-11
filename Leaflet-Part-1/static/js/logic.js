// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Using d3 to pull from queryURL
d3.json(queryUrl).then(function (data) {
  console.log(data);
  createFeatures(data.features);
});

// Function to determine marker size
function markerSize(magnitude) {
  return magnitude * 20000;
};

// Function to determine marker color by depth
function chooseColor(depth){
    if (depth >= 90) return "#ff0d0d";
    else if (depth < 90 && depth >= 70) return "fca35d";
    else if (depth < 70 && depth >= 50) return "#fdb72a";
    else if (depth < 50 && depth >= 30) return "#f7db11";
    else if (depth < 30 && depth >= 10) return "#dcf400";
    else return "#a3f600";
}

// Function for popup and style of markers
function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    pointToLayer: function(feature, latlng) {

      var markers = {
        radius: markerSize(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.7,
        color: "black",
        stroke: true,
        weight: 0.5
      }
      return L.circle(latlng,markers);
    }
  });
  createMap(earthquakes);
}


// Create map, add overlays, and add legend
function createMap(earthquakes) {

  var baselayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  var myMap = L.map("map", {
    center: [
      37.6000, -95.6650
    ],
    zoom: 2.5,
    layers: [baselayer, earthquakes]
  });

  var legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    depth = [-10, 10, 30, 50, 70, 90];

    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
      '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap)
};