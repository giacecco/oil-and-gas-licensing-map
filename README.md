fracking-map
============

**[READ ABOUT AN IMPORTANT UPDATE FURTHER DOWN IN THE 'SUMMARY' CHAPTER]**

## Summary

The UK Department for Energy and Climate Change (DECC) published in December 2013 the "Environmental report for further onshore oil and gas licensing" report, available [here](https://www.gov.uk/government/consultations/environmental-report-for-further-onshore-oil-and-gas-licensing) and mirrored in this GitHub repository [here](https://github.com/giacecco/fracking-map/tree/master/data/raw/DECC-report). The report included for the first time maps specifying what areas of the UK were being evaluated for exploitation, with shale gas being the main resource being targetted.

The documents are in PDF format and the maps look like the one below:

![Example of map in the original PDF files](https://raw.github.com/giacecco/fracking-map/master/images/map1.png)

Unfortunately, to the best of my knowledge, the specifications of the areas and their designation is not available in machine-readable format. It is the objective of this project to 'reverse engineer' the data available in the DECC documents to make it machine-readable and re-usable for open, value-added applications, starting from interactive and more usable versions of the maps themselves.

This information is particularly valuable for the public as - despite the fact that the UK Government is keen to heavily exploit the shale gas resources in the upcoming years - the mainstream technology for extraction, hydraulic fracturing, more commonly known as 'fracking', is controversial. The technology is relatively young and often associated to the risk of domestic incidents, seismic activity and health issues for the populations living in the areas subject to the extraction work (read [here](http://www.bbc.co.uk/news/uk-14432401) for example).

It is the objective of this project to 'reverse engineer' the data available in the DECC documents to make it machine-readable and re-usable for open, value-added applications, starting from interactive and more usable versions of the maps themselves.

**[23 DECEMBER 2013 UPDATE]**

Thanks to an exchange with DECC [on Twitter](https://twitter.com/giacecco/status/415106011976839168) I could find out that plenty of the data beyond the report is actually available at [https://www.gov.uk/oil-and-gas-onshore-maps-and-gis-shapefiles](https://www.gov.uk/oil-and-gas-onshore-maps-and-gis-shapefiles).

![Twitter exchange, 1 of 2](https://raw.github.com/giacecco/fracking-map/master/images/twitter1.png)

![Twitter exchange, 2 of 2](https://raw.github.com/giacecco/fracking-map/master/images/twitter2.png)

Moreover, the map for the areas that are already licensed can be browsed interactively on the UK Onshore Geophysical Library (UKOGL) website at [http://maps.lynxinfo.co.uk/UKOGL_LIVEV2/DeccLicences.html](http://maps.lynxinfo.co.uk/UKOGL_LIVEV2/DeccLicences.html), although, to tell you the truth, are not that readable (e.g. woudl you be able to find your house in the map below?). 

![Example of map on the UKOGL websitre](https://raw.github.com/giacecco/fracking-map/master/images/map2.png)

All of this is great news in any case, as I now just need to check that the data is usable and accessible by the public without the need of data analysis or programming skills. If that was the case, there would still be some work for me to do.

## The maps

The code for the interactive maps is available as the [gh-pages](https://github.com/giacecco/fracking-map/tree/gh-pages) branch of this GitHub project. At the moment of writing only a partial map equivalent to "Figure NTS 1" of page 6 in the original report is available and accessible at [http://www.digitalcontraptionsimaginarium.co.uk/fracking-map/](http://www.digitalcontraptionsimaginarium.co.uk/fracking-map/). 

For the sake of simplicity I have chosen csv as the format for the data extracted from the map. The file is available [here](https://github.com/giacecco/fracking-map/blob/gh-pages/data.csv) and captures the information of both the "Figure NTS 1" and "Figure NTS 2" figures. 

When loading the webpage, scripts convert the csv into GeoJSON and then render it using the [Leaflet](http://leafletjs.com) library on top of an [OpenStreetMap](http://www.openstreetmap.org) map.

## Status

This is work in progress. You are welcome to contribute and join the team. Please contact us using the project's [issues page](https://github.com/giacecco/fracking-map/issues). 

## Licence

![Creative Commons License](http://i.creativecommons.org/l/by/4.0/88x31.png "Creative Commons License") This work is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

Northing/Easting to Latitude/Longitude conversion is done using Chris Veness' JavaScript libraries available [here](http://www.movable-type.co.uk/scripts/latlong-gridref.html).