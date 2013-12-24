var AdmZip = require("adm-zip"),
	argv = require('optimist') 
		.usage('Usage: $0 command --out outputFolder')
		.demand([ 'out' ])
		.alias('out', 'o')
		.argv,
	exec = require('child_process').exec,
	fs = require("fs"),
	request = require("request");

var LICENSED_BLOCKS_URL = "https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/255517/Licensed_Blocks_On.zip",
	LICENSED_BLOCKS_ZIP_FILENAME = "Licensed_Blocks_On.zip",
	LICENSED_BLOCKS_SHAPEFILE_FILENAME = "Licensed_Blocks_On_Dec_2013.shp",
	LICENSED_BLOCKS_GEOJSON_FILENAME = "existingLicences.json";

// TODO: some exception management would not hurt
var	writeStream = fs.createWriteStream(argv.out + '/' + LICENSED_BLOCKS_ZIP_FILENAME);
writeStream.on('close', function() {
	var zip = new AdmZip(argv.out + "/" + LICENSED_BLOCKS_ZIP_FILENAME);
	zip.extractAllTo(argv.out, true);
	fs.unlinkSync(argv.out + "/" + LICENSED_BLOCKS_ZIP_FILENAME);
	exec("ogr2ogr -t_srs EPSG:4326 -f geoJSON " + argv.out + "/" + LICENSED_BLOCKS_GEOJSON_FILENAME + " " + argv.out + "/" + LICENSED_BLOCKS_SHAPEFILE_FILENAME, function (error, stdout, stderr) {
		console.log("Completed.");
	});
});
request(LICENSED_BLOCKS_URL).pipe(writeStream);

