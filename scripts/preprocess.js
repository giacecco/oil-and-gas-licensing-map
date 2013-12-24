var AdmZip = require("adm-zip"),
	argv = require('optimist') 
		.usage('Usage: $0 command --out outputFolder')
		.demand([ 'out' ])
		.alias('out', 'o')
		.argv,
	async = require('async'),
	exec = require('child_process').exec,
	fs = require("fs"),
	request = require("request");

var CONFIGURATIONS = [
	// existing licences
	{
		url: "https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/255517/Licensed_Blocks_On.zip",
		zipFilename: "Licensed_Blocks_On.zip",
		shapefileFilename: "Licensed_Blocks_On_Dec_2013.shp",
		geoJsonFilename: "existingLicences.json",
	},
	// "13th round" of licences offered
	{
		url: "https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/63944/13round-licences-offered.zip",
		zipFilename: "13round-licences-offered.zip",
		shapefileFilename: "13Round_Licences_Offered.shp",
		geoJsonFilename: "dec2013Offering.json",
	},
];

// TODO: some exception management would not hurt
async.eachSeries(CONFIGURATIONS, function (config, callback) {
	var	writeStream = fs.createWriteStream(argv.out + '/' + config.zipFilename);
	writeStream.on('close', function() {
		var zip = new AdmZip(argv.out + "/" + config.zipFilename);
		zip.extractAllTo(argv.out, true);
		fs.unlinkSync(argv.out + "/" + config.zipFilename);
		exec("ogr2ogr -t_srs EPSG:4326 -f geoJSON " + argv.out + "/" + config.geoJsonFilename + " " + argv.out + "/" + config.shapefileFilename, function (error, stdout, stderr) {
			callback(null);
		});
	});
	request(config.url).pipe(writeStream);
}, function (err) {
	console.log("Completed.");
});


