var	/* I found an explaination of the acronyms used for the licence types in
	   DECC's "The Unconventional Hydrocarbon Resources of Britain's Onshore 
	   Basins" document, available at https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/66171/promote-uk-cbm.pdf
	*/
	LICENCE_TYPES = {
		"al": "Appraisal",
		"dl": "Development",
		"ex": "Exploration",
		"exl": "Exploration",
		"ml": "Mining",
		"pedl": "Petroleum Exploration and Development (generic, post-1996)",
		"pl": "Production",
	},
	CONFIGURATION = {
		"layers": {
			// the order is relevant! from the bottom to the top one
			"Areas under consideration": {
				"dataFile": "areasUnderConsideration.csv",
				"dataType": "csv",
				"colour": "#FFFF66",
			},
			"December 2013 offering": {
				"dataFile": "dec2013Offering.json",
				"dataType": "geojson",
				"colour": "orange",
			},
			"Existing licences": {
				"dataFile": "existingLicences.json",
				"dataType": "geojson",
				"colour": "red",
			},
		}
	};	

var configuration,
	layers = { },
	map,
	layersControl,
	infoControl,
	titleControl, 
	zoomControl;

var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

var onEachFeature = function (feature, layer) {

	var highlightFeature = function (e) {
	    var layer = e.target;
	    layer.setStyle({
	        weight: 5,
	        color: '#666',
	        dashArray: '',
	        fillOpacity: 0.4
	    });
	    if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToFront();
	    }
		if (!qs.embed) infoControl.update(layer.feature.properties);
	}

	var resetHighlight = function (e) {
		// TODO is there a better way of doing this?
	    _.each(layers, function (layer) { layer.resetStyle(e.target) });
	    if (!qs.embed) infoControl.update();
	}

	var zoomToFeature = function (e) {
	    map.fitBounds(e.target.getBounds());
	}

	var openLicenceDetail = function (e) {
		if (!qs.embed) {
			window.open("https://www.og.decc.gov.uk/eng/fox/decc/PED300X/licence?LICENCE_TYPE=" + e.target.feature.properties["LICENCE_TY"] + "&LICENCE_NO="  + e.target.feature.properties["LICENCE"].match(/\d+/g), "_blank");
		} else {
			window.open("http://www.digitalcontraptionsimaginarium.co.uk/oil-and-gas-licensing-map/", "_blank");
		}
	}

	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature,
		dblclick: openLicenceDetail,
	});

}

var style = function (feature) {
    return {
        fillColor: configuration.layers[feature.properties.licenceType].colour,
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

var initMap = function () {

	_.mixin(_.str.exports());

	configuration = CONFIGURATION;
	async.each(_.keys(configuration.layers), function (layerName, callback) {
		switch (configuration.layers[layerName].dataType) {
			case "geojson":
				d3.json(configuration.layers[layerName].dataFile, function(data) { 
					configuration.layers[layerName].geoJSON = data;
					configuration.layers[layerName].geoJSON.features = _.map(
						configuration.layers[layerName].geoJSON.features, 
						function (feature) {
							feature.properties.licenceType = layerName;
							return feature;
						});
					callback(null); 
				});
				break;
			case "csv":
				makeGeoJSON(configuration.layers[layerName].dataFile, function (err, data) { 
					configuration.layers[layerName].geoJSON = data;
					configuration.layers[layerName].geoJSON.features = _.map(
						configuration.layers[layerName].geoJSON.features, 
						function (feature) {
							feature.properties.licenceType = layerName;
							return feature;
						});
					callback(err); 
				});
				break;
		}
	}, function (err) {

		// create the tile layer with correct attribution
		var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			osmAttrib='DECC <a target="_blank" href="https://www.gov.uk/oil-and-gas-onshore-maps-and-gis-shapefiles">oil and gas licensing data</a> is available under the <a target="_blank" href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/2/">Open Government Licence v2.0</a> | Map data © <a target="_blank" href="http://www.openstreetmap.org/about">OpenStreetMap</a> contributors',
			osm = new L.TileLayer(osmUrl, { minZoom: 1, maxZoom: 12, attribution: osmAttrib });		

		// set up the data layers
		_.each(_.keys(configuration.layers), function (layerName) {
			layers[layerName] = L.geoJson(configuration.layers[layerName].geoJSON, { 
				/* TODO I have tried defining styling functions in CONFIGURATION 
				but then layer.resetStyle fails */
				style: style, 
				onEachFeature: onEachFeature,
			});
		});

		// set up the map
		var defaultLayersToDisplay = [ osm ];
		if (qs.underConsideration != "hide") defaultLayersToDisplay = defaultLayersToDisplay.concat(layers["Areas under consideration"]);
		if (qs.offering2013 != "hide") defaultLayersToDisplay = defaultLayersToDisplay.concat(layers["December 2013 offering"]);
		if (qs.existing != "hide") defaultLayersToDisplay = defaultLayersToDisplay.concat(layers["Existing licences"]);
		map = new L.Map('map', {
			layers: defaultLayersToDisplay,	
			// layers: [ osm ].concat(_.values(layers)),	
			// layers: [ osm, layers["Existing licences"] ],	
			center: new L.LatLng(parseFloat(qs.lat) || 55.0, parseFloat(qs.lon) || -3.0),	
			zoom: parseInt(qs.zoom) || 6,
			zoomControl: false,
		});

		if (!qs.embed) {
			titleControl = L.control({ position: 'topleft' });
			titleControl.onAdd = function (map) {
			    this._div = L.DomUtil.create('div', 'titleControl'); 
			    this._div.innerHTML = "<h1>oil-and-gas-licensing-map</h1><p>This is a map of existing and potential future oil and gas onshore licences for petroleum exploration and production in the UK (not just shale gas), derived from data made available by the Department of Energy and Climate Change. Please read <a href=\"https://github.com/giacecco/oil-and-gas-licensing-map\">here</a> for more information.</p><p>Information is provided \"as is\", without warranty of any kind, express or implied. Don't buy your next house basing your decision on this map! :-)</p>";
			    return this._div;
			};
			titleControl.addTo(map);
		}

		// set up the 'layers control'
		// TODO make the looks of this control consistent with the others, first attempt failed
		// L.control.layers(undefined, layers, { collapsed: false }).addTo(map);
		var layersForControl = { };
		_.each(_.keys(layers), function (layerName) {
			layersForControl[layerName + "&nbsp;<div style='width:10px;height:10px;border:1px solid black;background-color:" + configuration.layers[layerName].colour + ";display:inline-block'></div>"] = layers[layerName];
		});
		layersControl = L.control.layers(undefined, layersForControl, { collapsed: false, position: 'topleft' });
		layersControl.addTo(map);

		// set up the 'info control'
		if (!qs.embed) {

			infoControl = L.control();
			infoControl.onAdd = function (map) {
			    this._div = L.DomUtil.create('div', 'infoControl'); 
			    this.update();
			    return this._div;
			};

			// method that we will use to update the control based on feature properties passed
			infoControl.update = function (properties) {
				if (properties) {
			    	this._div.innerHTML = 
			    		'<h4>Licensing info</h4>' + 
			    		_.reduce(_.keys(properties).sort(), function (memo, propertyName) {
		    				// TODO: there are several GeoJSON features' properties 
		    				// in the DECC data that have null properties
			    			if (properties[propertyName] != null) {
					    		switch (propertyName.toLowerCase()) {
					    			case "round":
					    				// just rename the label
										return memo + "<b>Licensing Round No.</b><br />" + _.capitalize(properties[propertyName].toString().toLowerCase()) + "<br />";
										break
									case "licence":
										return memo + "<b>Licence</b><br />" + _.capitalize(properties[propertyName].toString().toLowerCase()) + "<br />(double-click to see the details on the DECC website)<br />";
										break;
					    			case "licence_ty":
					    				// replace the value with the readable licence type
										return memo + "<b>Licence Type</b><br />" + LICENCE_TYPES[properties["LICENCE_TY"].toLowerCase()] + "<br />";
					    				break;
					    			case "licencetype":
					    				// do nothing, these are for internal use
					    				return memo;
					    				break;
					    			default:
										return memo + "<b>" + _.capitalize(propertyName.toLowerCase()) + "</b><br />" + _.capitalize(properties[propertyName].toString().toLowerCase()) + "<br />";
					    		}
					    	} else {
					    		return memo;
					    	}
			    		}, "");
			    } else {
			    	this._div.innerHTML = '<h4>Licensing info</h4>Hover over the map to select an area of interest' 
			    }
			};
			infoControl.addTo(map);
		}

		// explicitly adding the zoom control so that it is below the titleControl
		zoomControl = L.control.zoom().addTo(map);

	});
}
