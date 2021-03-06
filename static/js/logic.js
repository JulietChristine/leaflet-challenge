// Logic for Earthquake Map


// create a function that returns a color based on magnitude 
function getColor(mag) {
  return mag <= 1 ? "#ADFF2F" :
         mag <= 2 ? "#9ACD32" :
         mag <= 3 ? "#FFFF00" :
         mag <= 4 ? "#FFD700" :
         mag <= 5 ? "#FFA500" :
                    "#FF0000" ;
}


  // calling the API and d3
  let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

  tectonicPlates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
  
  let tplateBoundaries = new L.LayerGroup();
  
  d3.json(tectonicPlates, function (plates) {
     L.geoJSON(plates.features, {
         style: function (plateFeature) {
             return {
                 weight: 1,
                 color: 'Orange'
             }
         },
     }).addTo(tplateBoundaries);
  })
  
  d3.json(geoData, function(data) {

    createFeatures(data.features);
    
  });
  
  function createFeatures(earthquakeData) {
  
    let earthquakes = L.geoJSON(earthquakeData)
  
    var earthquakeMarkers = [];
  
    for (let i = 0; i < earthquakeData.length; i++) {

      earthquakeMarkers.push(L.circle([earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]], {
        fillOpacity: 0.65,
        color: "black",
        weight: 0.65,
        fillColor: getColor(earthquakeData[i].properties.mag),
        radius: earthquakeData[i].properties.mag * 32000 
      }).bindPopup("<p><strong>" + "Location" + "</strong><br>" + earthquakeData[i].properties.place + "</br></p><hr><p><strong>" + "Magnitude" + "</strong><br>" + earthquakeData[i].properties.mag + "</br></p>")
      )

      var earthquakeLayer = L.layerGroup(earthquakeMarkers);
    }
   
      createMap(earthquakeLayer);
    }
      
  
  function createMap(earthquakes) {
  
    // Map Layers
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
      "Plates Boundary": tplateBoundaries,
    };
  
    // Let's make the map
    let myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 3.5,
      layers: [satellite, earthquakes, tplateBoundaries]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
    
        let div = L.DomUtil.create('div', 'info legend'),
            mag = [0, 1, 2, 3, 4, 5],
            labels = ['#ADFF2F', '#9ACD32', '#FFFF00', '#FFD700', '#FFA500', '#FF0000'];
            
        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < mag.length; i++) {
            div.innerHTML +=
                '<i style="background:' + labels[i] + '"></i> ' +
                mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
        }
    
        return div;
    }
    
    legend.addTo(myMap); 

  }

  