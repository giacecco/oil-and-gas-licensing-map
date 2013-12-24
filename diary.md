# 18 December 2013 

I find out thanks to [an article in the Guardian]http://www.theguardian.com/environment/2013/dec/17/fracking-huge-impact-uk-shale-gas-industry-revealed) that the map of the UK areas being evaluated for shale gas extraction was made available in the context of a wider DECC report. I decide that that would be a great open data exercise.

![My tweet as I found out about the new DECC report](https://raw.github.com/giacecco/fracking-map/master/images/twitter3.png)

I start developing a prototype based on 'reversing engineering' the information I see in the PDF files as apparently there is no machine-readable data I can use.

![Screenshot](https://raw.github.com/giacecco/fracking-map/master/images/screenshot1.png)

# 23 December 2013

Thanks to an exchange with DECC [on Twitter](https://twitter.com/giacecco/status/415106011976839168) I find out that plenty of the data beyond the report is actually available at [https://www.gov.uk/oil-and-gas-onshore-maps-and-gis-shapefiles](https://www.gov.uk/oil-and-gas-onshore-maps-and-gis-shapefiles).

![Twitter exchange, 1 of 2](https://raw.github.com/giacecco/fracking-map/master/images/twitter1.png)

![Twitter exchange, 2 of 2](https://raw.github.com/giacecco/fracking-map/master/images/twitter2.png)

Moreover, the map for the areas that are already licensed can be browsed interactively on the UK Onshore Geophysical Library (UKOGL) website at [http://maps.lynxinfo.co.uk/UKOGL_LIVEV2/DeccLicences.html](http://maps.lynxinfo.co.uk/UKOGL_LIVEV2/DeccLicences.html), although, to tell you the truth, are not that readable (e.g. woudl you be able to find your house in the map below?). 

![Example of map on the UKOGL website](https://raw.github.com/giacecco/fracking-map/master/images/map2.png)

All of this is great news in any case, as I now just need to check that the data is usable and accessible by the public without the need of data analysis or programming skills. If that was the case, there would still be some work for me to do.

Most of the files are from a GIS system. I have some time to start playing with the format, that I never had the opportunity to use. It immediately shows to be much more Linux- than MacOS-friendly. I've tested:

- https://github.com/substack/shp2json converts GIS .zip files to GeoJSON... simple and ideal... and crashes as soon as I launch it on both Linux and MacOS. It's not been maintained for a while, submitted an issue...
- http://vallandingham.me/shapefile_to_geojson.html explains some of the theory, very useful. By using ogr2ogr I manage to convert the GIS shapefiles to GeoJSON yeah... but I also need to find a way to browse the shapefiles before doing that, to know what I am dealing with...

Wow this is amazing. A command like the one below:

    ogr2ogr -t_srs EPSG:4326 -f geoJSON test.json Licensed_Blocks_On_Dec_2013.shp

takes a GIS shapefile with shapes expressed in National Grid coordinates (OSGB36, the "EPSG" in the command) and converts it straight away in a GeoJSON in latitude/longitude coordinates (WGS84, the "4326" in the command). I found the hunch [here](http://stackoverflow.com/a/1541575/1218376)).

Now I need to test the sample file by putting it on top of an UK map and see if it matches what I know it is supposed to look like.

# 24 December 2013

Started yesterday night in bed writing the scripts that automate downloading the source DECC files and prepare them for the website, starting from the already existing licences. It already looks good on the map.

![Early rendering on the map of the original DECC data](https://raw.github.com/giacecco/fracking-map/master/images/screenshot2.png)

