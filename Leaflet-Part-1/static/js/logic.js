// Initialize the map and set its view
var map = L.map('map').setView([37.7749, -122.4194], 5); // Centered on California

// Add a tile layer (basemap) to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18,
}).addTo(map);


// Define a function to set the color based on earthquake depth
function getColor(depth) {
    return depth > 90 ? '#FF0000' :  // Red
        depth > 70 ? '#FF4500' :  // Orange Red
        depth > 50 ? '#FF8C00' :  // Dark Orange
        depth > 30 ? '#FFD700' :  // Gold
        depth > 10 ? '#ADFF2F' :  // Green Yellow
                 '#00FF00';   // Green
}

// Define a function to set the radius of the marker based on magnitude
function getRadius(magnitude) {
    return magnitude * 4;  // Adjust multiplier to change marker size
}


// Get the earthquake geojson file endpoint
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(geoData).then(function(data) {
    // Add GeoJSON layer to the map
    L.geoJson(data, {
        // Use pointToLayer to create circle markers
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        // Style each feature (circle marker)
        style: function(feature) {
            return {
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
        },
        // Add popups to each marker
        onEachFeature: function(feature, layer) {
            layer.bindPopup(
                `<h3>Location: ${feature.properties.place}</h3>
                <hr>
                <p><strong>Magnitude:</strong> ${feature.properties.mag}</p>
                <p><strong>Depth:</strong> ${feature.geometry.coordinates[2]} km</p>
                <p><strong>Time:</strong> ${new Date(feature.properties.time)}</p>`
            );
        }
    }).addTo(map)
    
    // Define limits and colors for the legend
    let limits = [0, 10, 30, 50, 70, 90];
    let colors = limits.map(limit => getColor(limit + 1));

    // Set up the legend.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        div.style.backgroundColor = "white";
        div.style.padding = "10px";
        div.style.borderRadius = "5px";
        div.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.3)";
        let labels = [];

        // Generate legend labels with color boxes stacked vertically
        for (var i = 0; i < limits.length; i++) {
            labels.push(
                '<i style="background:' + colors[i] + '; width: 18px; height: 18px; display: inline-block;"></i> ' +
                limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+')
            );
        }

        div.innerHTML = labels.join('');
        return div;
    };

    // Adding the legend to the map
    legend.addTo(map);
});




