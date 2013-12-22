fracking-map
============

# Summary

The UK Department for Energy and Climate Change (DECC) published in December 2013 the "Environmental report for further onshore oil and gas licensing" report. It included for the first time maps specifying what areas of the UK were being evaluated for exploitation, with shale gas being the main resource being targetted.

The documents are in PDF format and the maps look like the one below:

![Example of map in the original PDF files](https://raw.github.com/giacecco/fracking-map/master/images/map1.png)

Unfortunately, to the best of my knowledge, the specifications of the areas and their designation is not available in machine-readable format. It is the objective of this project to 'reverse engineer' the data available in the DECC documents to make it machine-readable and re-usable for open, value-added applications, starting from interactive and more usable versions of the maps themselves.

# The maps

The code for the interactive maps is available as the [gh-pages](https://github.com/giacecco/fracking-map/tree/gh-pages) branch of this GitHub project. At the moment of writing only a partial map equivalent to "Figure NTS 1" of page 6 in the original report is available and accessible at [http://www.digitalcontraptionsimaginarium.co.uk/fracking-map/](http://www.digitalcontraptionsimaginarium.co.uk/fracking-map/). 

For the sake of simplicity I have chosen csv as the format for the data extracted from the map. The file is available [here](https://github.com/giacecco/fracking-map/blob/gh-pages/data.csv) and captures the information of both the "Figure NTS 1" and "Figure NTS 2" figures. 

When loading the webpage, scripts convert the csv into GeoJSON and then render it using the [Leaflet](http://leafletjs.com) library on top of an [OpenStreetMap](http://www.openstreetmap.org) map.

# Status

This is work in progress. You are welcome to contribute and join the team. Please contact us using the project's [issues page](https://github.com/giacecco/fracking-map/issues). 

# Licence

![Creative Commons License](http://i.creativecommons.org/l/by/4.0/88x31.png "Creative Commons License") This work is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

Northing/Easting to Latitude/Longitude conversion is done using Chris Veness' JavaScript libraries available [here](http://www.movable-type.co.uk/scripts/latlong-gridref.html).