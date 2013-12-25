var	/* These are the approximated boundaries of the original map in the 
	   "Strategic Environmental Assessment for Further Onshore Oil and Gas 
	   Licensing" report, figure 'NTS 1'. No information is available beyond
	   these boundaries, we need to presume that they are neither already 
	   licensed nor under consideration. */
	MAP_BOUNDARIES = {
		EASTING: 50000,
		NORTHING: 950000,
		WIDTH: 710000, 
		HEIGHT: 910000
	};

var configuration,
	map,
	geoJSON,
	info;

var makeGeoJSON = function (dataFile, callback) {
	d3.csv(dataFile, function (data) {
		var featureCount = 0,
			geoJSON = {
				type: "FeatureCollection",
				features: [ ]
			};
		_.each(data, function (square) {
			var latLon = [ 
				OsGridRef.osGridToLatLong({ easting: parseFloat(square.easting), northing: parseFloat(square.northing) }),
				OsGridRef.osGridToLatLong({ easting: parseFloat(square.easting) + parseFloat(square.width), northing: parseFloat(square.northing) }),
				OsGridRef.osGridToLatLong({ easting: parseFloat(square.easting) + parseFloat(square.width), northing: parseFloat(square.northing) - parseFloat(square.height) }),
				OsGridRef.osGridToLatLong({ easting: parseFloat(square.easting), northing: parseFloat(square.northing) - parseFloat(square.height) }),
			];
			geoJSON.features.push({
				type: "Feature",
				// TODO: is defining an id of any use? 
				// id: (++featureCount).toString(),
				properties: {
					license: square.license,
				},
				geometry: {
					type: "Polygon",
					coordinates: [[ 
						// TODO: I am sure that there is a cooler way to write this
						[ latLon[0].lon(), latLon[0].lat() ],
						[ latLon[1].lon(), latLon[1].lat() ],
						[ latLon[2].lon(), latLon[2].lat() ],
						[ latLon[3].lon(), latLon[3].lat() ],
					]],
				}
			});
		});
		callback(null, geoJSON);
	});
};

var onEachFeature = function (feature, layer) {

	var highlightFeature = function (e) {
	    var layer = e.target;
	    layer.setStyle({
	        weight: 5,
	        color: '#666',
	        dashArray: '',
	        fillOpacity: 0.7
	    });
	    if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToFront();
	    }
	    info.update(layer.feature.properties);
	}

	var resetHighlight = function (e) {
	    geoJSON.resetStyle(e.target);
	    info.update();
	}

	var zoomToFeature = function (e) {
	    map.fitBounds(e.target.getBounds());
	}

	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});

}

var getLicenceColour = function (value) {
	var colour = "#EEFCED";
	switch (value) {
		case "area under consideration":
			colour = "yellow";
			break;
		case "existing":
			colour = "red";
			break;
		case "2013 offering":
			colour = "orange";
			break;
	}
	return colour;
}

var style = function (feature) {
    return {
        fillColor: getLicenceColour(feature.properties.licenseStatus),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

var initMap = function () {
	d3.json("configuration.json", function (c) { 
		configuration = c;
		configuration.geoJSON = {
			type: "FeatureCollection",
			features: [ ]
		};
		async.each(_.values(configuration.layers), function (layer, callback) {
			switch (layer.dataType) {
				case "geojson":
					d3.json(layer.dataFile, function(data) { 
						configuration.geoJSON.features = configuration.geoJSON.features.concat(_.map(data.features, function (feature) {
							feature.properties.licenseStatus = layer.licenseStatus;
							return feature;
						})); 
						callback(null); 
					});
					break;
				case "csv":
					makeGeoJSON(layer.dataFile, function (err, data) { 
						configuration.geoJSON.features = configuration.geoJSON.features.concat(_.map(data.features, function (feature) {
							feature.properties.licenseStatus = layer.licenseStatus;
							return feature;
						})); 
						callback(err); 
					});
					break;
			}
		}, function (err) {

			// set up the map
			map = new L.Map('map');
			// create the tile layer with correct attribution
			var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
			var osmAttrib='Map data © OpenStreetMap contributors';
			var osm = new L.TileLayer(osmUrl, { minZoom: 1, maxZoom: 12, attribution: osmAttrib });		
			// start the map in South-East England
			map.setView(new L.LatLng(55.6, -3.0), 7);
			map.addLayer(osm);

			// set up the 'info control'
			info = L.control();
			info.onAdd = function (map) {
			    this._div = L.DomUtil.create('div', 'info'); 
			    this.update();
			    return this._div;
			};
			// method that we will use to update the control based on feature properties passed
			info.update = function (properties) {
				if (properties) {
				    this._div.innerHTML = 
				    	'<h4>Licensing status</h4>' + 
						_.map(properties, function (memo, propertyName) {
							return "<b>" + propertyName + "</b><br />" + properties[propertyName];
						}).join('<br />');
			    } else {
			    	this._div.innerHTML = '<h4>Licensing status</h4>Hover over the map' 
			    }
			};
			info.addTo(map);

			// set up the legend
			var legend = L.control({position: 'bottomright'});
			legend.onAdd = function (map) {
			    var div = L.DomUtil.create('div', 'info legend');
			    div.innerHTML = "Hello, this will become the legend";
		    	return div;
			};
			legend.addTo(map);

			// set up the layers
			geoJSON = L.geoJson(configuration.geoJSON, { 
				style: style,
				onEachFeature: onEachFeature
			}).addTo(map);

		});
	});
}
