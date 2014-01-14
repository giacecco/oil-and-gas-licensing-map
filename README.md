oil-and-gas-licensing-map
=========================

[http://www.digitalcontraptionsimaginarium.co.uk/oil-and-gas-licensing-map/](http://www.digitalcontraptionsimaginarium.co.uk/oil-and-gas-licensing-map/)

## Table of Contents

- [Summary](https://github.com/giacecco/oil-and-gas-licensing-map#summary)
- [Sources and Data pre-processing](https://github.com/giacecco/oil-and-gas-licensing-map#sources-and-data-pre-processing)
- [The map](https://github.com/giacecco/oil-and-gas-licensing-map#the-map)
- [Get the data](https://github.com/giacecco/oil-and-gas-licensing-map#get-the-data)
- [Status](https://github.com/giacecco/oil-and-gas-licensing-map#status)
- [Credits](https://github.com/giacecco/oil-and-gas-licensing-map#credits)
- [Licence](https://github.com/giacecco/oil-and-gas-licensing-map#licence)

## Summary

The UK Department for Energy and Climate Change (DECC) published in December 2013 the "Environmental report for further onshore oil and gas licensing" report, available [here](https://www.gov.uk/government/consultations/environmental-report-for-further-onshore-oil-and-gas-licensing). The report included maps specifying what areas of the UK were being evaluated for exploitation, with shale gas being the main resource being targetted.

This information is particularly valuable for the public as - despite the fact that the UK Government is keen to heavily exploit the shale gas resources in the upcoming years - the mainstream technology for extraction, hydraulic fracturing, more commonly known as 'fracking', is controversial. The technology is relatively young and often associated to the risk of domestic incidents, seismic activity and health issues for the populations living in the areas subject to the extraction work (e.g. read [here](http://www.bbc.co.uk/news/uk-14432401)).

I decided to start a little investigation over the data published by the DECC that made me realise how much valuable information is actually available but often not that accessible or easy to interpret. A great example is the map for the areas that are already licensed, that can be browsed interactively on the UK Onshore Geophysical Library (UKOGL) website at [http://maps.lynxinfo.co.uk/UKOGL_LIVEV2/DeccLicences.html](http://maps.lynxinfo.co.uk/UKOGL_LIVEV2/DeccLicences.html). Would you be able to find an address in the map below, e.g. if you were looking to buy a house in the area?

![Example of map on the UKOGL website](https://raw.github.com/giacecco/oil-and-gas-licensing-map/master/images/map2.png)

What about this map instead?

![Example of my map](https://raw.github.com/giacecco/oil-and-gas-licensing-map/master/images/map3.png)

## Sources and Data pre-processing

### Sources

All the data the map is based upon comes from two sources:

- The areas subject to existing licences and the current (13th) round of licence offering comes from DECC's "Oil and gas: onshore maps and GIS shapefiles" webpage, available online at [https://www.gov.uk/oil-and-gas-onshore-maps-and-gis-shapefiles](https://www.gov.uk/oil-and-gas-onshore-maps-and-gis-shapefiles). The files were downloaded on 24/12/2013. I used the shapefiles names "13th round licences offered" and "Onshore licences". I presumed that the former is to be considered in addition to the latter, although you can easily observe that many areas actually overlap and it still is not clear to me how to interpret that.

- The areas that are under consideration for oil and gas exploitation are defined in "Figure NTS 1" and "Figure NTS 2" of the "Strategic Environmental Assessment for further onshore oil and gas licensing: environmental report" DECC document available online at [https://www.gov.uk/government/consultations/environmental-report-for-further-onshore-oil-and-gas-licensing](https://www.gov.uk/government/consultations/environmental-report-for-further-onshore-oil-and-gas-licensing). The document is dated "December 2013". I could not find the information in machine-readable format and had to manually write down the information for each of the >1k squares highlighted on the map as such (the result CSV file can be seen [here](https://github.com/giacecco/fracking-map/blob/master/data/raw/areasUnderConsideration.csv)).

![Example of map in the original PDF files](https://raw.github.com/giacecco/oil-and-gas-licensing-map/master/images/map1.png)

The final website also references DECC's publicly available licence data archive at [https://www.og.decc.gov.uk/information/licence_reports/onshorebylicence.html](https://www.og.decc.gov.uk/information/licence_reports/onshorebylicence.html). At the moment of writing a decision has not been taken on eventually caching the same information locally, that could be quite useful.

### Data pre-processing

As I used [Leaflet](http://leafletjs.com/) for visualising the licensed areas on the map, I need their definition in a format Leaflet could use. I chose GeoJSON.

The existing and 13th round of licence offering data are provided by DECC in GIS shapefile format. Conversion to GeoJSON is easily done by using a command line utility called _ogr2ogr_ that is part of GDAL: the Geospatial Data Abstraction Library (read more [here](http://www.gdal.org/)). ogr2ogr is also used for conversion from the National Grid coordinates to latitude / longitude. Just two commands are required, after having downloaded and unzipped the source files from the DECC website:

    ogr2ogr -t_srs EPSG:4326 -f geoJSON existingLicences.json Licensed_Blocks_On_Dec_2013.shp
    ogr2ogr -t_srs EPSG:4326 -f geoJSON dec2013Offering.json 13Round_Licences_Offered.shp

The Node.js (preprocess.js script)[https://github.com/giacecco/oil-and-gas-licensing-map/blob/master/scripts/preprocess.js] does all of the above automatically, from downloading to conversion. 

The definition of the areas under consideration is instead translated from CSV and National Grid coordinates onto GeoJSON and latitude / longitude coordinates by the webpage itself.

## The map

The code for the interactive maps is available as a branch of this project called [gh-pages](https://github.com/giacecco/oil-and-gas-licensing-map/tree/gh-pages). The website is accessible at [http://www.digitalcontraptionsimaginarium.co.uk/fracking-map/](http://www.digitalcontraptionsimaginarium.co.uk/oil-and-gas-licensing-map/). 

## Get the data

Below is the set of raw and processed data files used by the map:

- [areasUnderConsideration.csv](https://raw.github.com/giacecco/oil-and-gas-licensing-map/gh-pages/areasUnderConsideration.csv): the list of 10,000 x 10,000 squares defined by DECC to be under consideration for licensing
- [existingLicences.json](https://raw.github.com/giacecco/oil-and-gas-licensing-map/gh-pages/existingLicences.json): the GeoJSON of the existing licences, as translated from DECC's original GIS shapefile
- [dec2013Offering.json](https://raw.github.com/giacecco/oil-and-gas-licensing-map/gh-pages/dec2013Offering.json): the GeoJSON of the 13th round of licence offering, as translated from DECC's original GIS shapefile

## Status

This is work in progress. You are welcome to contribute and join the team. Please contact us using the project's [issues page](https://github.com/giacecco/oil-and-gas-licensing-map/issues). 

## Credits 

I need to thank DECC for positively responding to my challenges on Twitter so far and to point me at some of their resources that were key to my work. 

![Twitter exchange, 1 of 2](https://raw.github.com/giacecco/oil-and-gas-licensing-map/master/images/twitter1.png)

![Twitter exchange, 2 of 2](https://raw.github.com/giacecco/oil-and-gas-licensing-map/master/images/twitter2.png)

I truly hope DECC will welcome my initiative and perhaps make it its own. If they ask, I will be glad to support them assessing to what degree their website and documentation are really accessible and comprehensible for a non-specialist audience and if what they are doing to align to [the UK Government's efficiency, transparency and accountability agenda](https://www.gov.uk/government/topics/government-efficiency-transparency-and-accountability) is sufficient.

## Licence

![Creative Commons License](http://i.creativecommons.org/l/by/4.0/88x31.png "Creative Commons License") This work is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

Northing/Easting to Latitude/Longitude conversion in JavaScript code is done using Chris Veness' JavaScript libraries available [here](http://www.movable-type.co.uk/scripts/latlong-gridref.html).

All of DECC's data used by this project is licensed under the [Open Government License v2.0](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/2/). 

![ODI badge](https://raw.github.com/giacecco/oil-and-gas-licensing-map/master/images/odiBadge.png) The data used for this project has achieved the Open Data Institute's Open Data Certificate ["Pilot level"](https://certificates.theodi.org/datasets/1164/certificates/13292) on 13 January 2014, which means extra effort went in to support and encourage feedback from people who use this open data.