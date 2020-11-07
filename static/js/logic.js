// Logic for Earthquake Map


// create a function that returns a color based on magnitude 
function getColor(mag) {
    if (mag <= 1) {
        return "#ADFF2F";
    } else if (mag <= 2) {
        return "#9ACD32";
    } else if (mag <= 3) {
        return "#FFFF00";
    } else if (mag <= 4) {
        return "#FFD700";
    } else if (mag <= 5) {
        return "#FFA500";
    } else {
        return "#FF0000";
    };
  }
  
  
  // calling the API and d3
  let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

  tectonicPlates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
  
  let plateBoundary = new L.LayerGroup();
  
  d3.json(tectonicPlates, function (plates) {
     L.geoJSON(plates.features, {
         style: function (plateFeature) {
             return {
                 weight: 1,
                 color: 'Orange'
             }
         },
     }).addTo(plateBoundary);
  })
  
  
  d3.json(geoData, function(data) {

    createFeatures(data.features);
    
  });
  
  function createFeatures(earthquakeData) {
  
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  
    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    var earthquakeMarkers = [];
  
    for (let i = 0; i < earthquakeData.length; i++) {

      earthquakeMarkers.push(L.circle([earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]], {
        fillOpacity: 0.65,
        color: getColor(earthquakeData[i].properties.mag),
        fillColor: getColor(earthquakeData[i].properties.mag),
        radius: earthquakeData[i].properties.mag * 30000 
      })
      )

      var earthquakeLayer = L.layerGroup(earthquakeMarkers);
    }
   
      createMap(earthquakeLayer);
    }
      
  
  function createMap(earthquakes) {
  
    // Define streetmap and darkmap layers
    let satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',{
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/satellite-v9",
      accessToken: API_KEY
    });
  
    let grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',{
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/dark-v10",
      accessToken: API_KEY
    });
  
    let outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',{
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/outdoors-v10",
      accessToken: API_KEY
    });
     
    // Basemaps!
    let baseMaps = {
      "Satellite Map": satellite,
      "Gray Scale Map": grayscale,
      "Outdoors Map": outdoors
    };
  
    // Overlay Maps!
    let overlayMaps = {
      "Earthquakes": earthquakes,
      "Plates Boundary": plateBoundary,
    };
  
    // Let's make the map
    let myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 3,
      layers: [satellite, earthquakes, plateBoundary]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  }

  