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
	"html": "<p>Hello!</p>",
	"src": [ 
		fs.readFileSync("./lib/underscore-1.5.2.min.js", "utf-8"),
		fs.readFileSync("./lib/d3js-3.3.13.min.js", "utf-8"),
		fs.readFileSync("./lib/latlon.js", "utf-8"),
		fs.readFileSync("./lib/gridref.js", "utf-8"),
		fs.readFileSync("./createGeoJSONFromCSV2.js", "utf-8"),
	],
  	"done": function (errors, window) {
  		// console.log(window.d3);
  		window.makeGeoJSON(argv.url, function (err, geoJSON) {
  			fs.writeFileSync(argv.out, JSON.stringify(geoJSON), { encoding: 'utf-8' });
  		});
	}
});
