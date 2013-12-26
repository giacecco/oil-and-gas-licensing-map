

var makeGeoJSON = function (data) {
	var featureCount = 0,
		geoJSON = {
			type: "FeatureCollection",
			features: [ ]
		};
	_.each(data, function (square) {
		var latLon = [ 
			OsGridRef.osGridToLatLong({ easting: parseFloat(square.easting), northing: parseFloat(square.northing) }),
			OsGridRef.osGridToLatLong({ easting: parseFloat(square.easting) + 10000., northing: parseFloat(square.northing) }),
			OsGridRef.osGridToLatLong({ easting: parseFloat(square.easting) + 10000., northing: parseFloat(square.northing) - 10000. }),
			OsGridRef.osGridToLatLong({ easting: parseFloat(square.easting), northing: parseFloat(square.northing) - 10000. }),
		];
		geoJSON.features.push({
			type: "Feature",
			// TODO: is defining an id of any use? 
			// id: (++featureCount).toString(),
			properties: {
				"SEA area": square["SEA area"],
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
	return geoJSON;
};
