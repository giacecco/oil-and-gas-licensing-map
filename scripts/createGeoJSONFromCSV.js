/*
	The design of this script is quite convoluted. The reason for that is that I
	wanted to keep using the same latitude/longitude to UK National Grid 
	conversion libraries by Chris Veness that I use on the website.

	It works by creating a 'virtual' web browser (jsdom) and then loading itself
	within that browser and using the 'makeGeoJSON' function defined there, 
	which in turn uses the Veness' libraries.
*/

var makeGeoJSON;

if (typeof(window) == "undefined") {

	// This is executed in Node.js

	var fs = require("fs"),
		jsdom = require("jsdom"),
		argv = require('optimist') 
			.usage('Usage: $0 command --url csvFileURL --out outputGeoJSONFile')
			.default('url', "https://raw.github.com/giacecco/fracking-map/master/data/raw/areasUnderConsideration.csv")
			.demand([ 'out', 'url' ])
			.alias('out', 'o')
			.alias('url', 'u')
			.argv;

	jsdom.env({
		"html": "<p></p>",
		"scripts": [
			"https://raw.github.com/giacecco/fracking-map/gh-pages/lib/underscore-1.5.2.min.js",
			"https://raw.github.com/giacecco/fracking-map/gh-pages/lib/d3js-3.3.13.min.js",
			"https://raw.github.com/giacecco/fracking-map/gh-pages/lib/latlon.js",
			"https://raw.github.com/giacecco/fracking-map/gh-pages/lib/gridref.js",
		],
		"src": [ 
			fs.readFileSync("./createGeoJSONFromCSV.js", "utf-8"),
		],
	  	"done": function (errors, window) {
	  		// console.log(window.d3);
	  		window.makeGeoJSON(argv.url, function (err, geoJSON) {
	  			fs.writeFileSync(argv.out, JSON.stringify(geoJSON), { encoding: 'utf-8' });
	  		});
		}
	});

} else {

	// This is executed in the simulated web browser

	makeGeoJSON = function (dataFile, callback) {
		d3.csv(dataFile, function (data) {
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
			callback(null, geoJSON);
		});
	};

}