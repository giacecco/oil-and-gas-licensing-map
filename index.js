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
	},
	CONFIGURATION = {
		"layers": {
			"Existing licences": {
				"dataFile": "existingLicences.json",
				"dataType": "geojson",
				"licenseStatus": "existing"
			},
			"December 2013 offering": {
				"dataFile": "dec2013Offering.json",
				"dataType": "geojson",
				"licenseStatus": "2013 offering"
			},
			"Areas under consideration": {
				"dataFile": "areasUnderConsideration.csv",
				"dataType": "csv",
				"licenseStatus": "area under consideration"
			}
		}
	};	

var configuration,
	map,
	layers = { },
	layersControl,
	info;

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
		// TODO is there a better way of doing this?
	    _.each(layers, function (layer) { layer.resetStyle(e.target) });
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
	configuration = CONFIGURATION;
	async.each(_.keys(configuration.layers), function (layerName, callback) {
		switch (configuration.layers[layerName].dataType) {
			case "geojson":
				d3.json(configuration.layers[layerName].dataFile, function(data) { 
					configuration.layers[layerName].geoJSON = data;
					callback(null); 
				});
				break;
			case "csv":
				makeGeoJSON(configuration.layers[layerName].dataFile, function (err, data) { 
					configuration.layers[layerName].geoJSON = data;
					callback(err); 
				});
				break;
		}
	}, function (err) {

		// create the tile layer with correct attribution
		var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			osmAttrib='Map data © OpenStreetMap contributors',
			osm = new L.TileLayer(osmUrl, { minZoom: 1, maxZoom: 12, attribution: osmAttrib });		

		// set up the data layers
		_.each(_.keys(configuration.layers), function (layerName) {
			layers[layerName] = L.geoJson(configuration.layers[layerName].geoJSON, { 
				style: style,
				onEachFeature: onEachFeature
			});
		});

		// set up the map
		map = new L.Map('map', {
			layers: [ osm ].concat(_.values(layers)),	
			center: new L.LatLng(55.0, -3.0),	
			zoom: 6,
		});

		// set up the 'layers control'
		// TODO make the looks of this control consistent with the others, first attempt failed
		L.control.layers(undefined, layers, { collapsed: false }).addTo(map);

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


	});
}
