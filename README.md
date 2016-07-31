osm2geojsonstream
===========

Streams OSM data in XML format to GeoJSON. Generates GeoJSON features from OSM ways and nodes. 

This is a fork from Ryan Clark's osm2geojson library, forked before osm2geojson incorporated osmium.

### Install it globally
```shell
npm install -g osm2geojsonstream
```

### Use it from the command line like this
```shell
osm2geojsonstream -b "[-111.01032257080078,31.314701127170984,-110.68004608154295,31.447492524518246]"
```
That will download data from the specified area. Make sure it is not more than 0.25 sq.deg. If you have an extracted XML file, you can...
```shell
osm2geojsonstream -f /path/to/osm.xml
```
You may want to redirect the results to a file unless you can read really fast...
```shell
osm2geojsonstream -f /path/to/osm.xml > osm.geojson
```

### Use it in another project like this
```
npm install osm2geojsonstream
```
... then in your own scripts:
```javascript
osm2geojsonstream = require("osm2geojsonstream")();
aReadableStream.pipe(osm2geojsonstream).pipe(aWritableStream);
```

### Optional filtering and mapping

The function returned by `require('osm2geojsonstream')` can take two optional arguments -- a filter function and a mapping function.

A "filter function" should return `true` for the features you care about, and `false` for those you don't. Those that return `false` will not be included in the final GeoJSON FeatureCollection.

For example:
```javascript
osm2geojsonstream = require("osm2geojsonstream")(function (feature) {
    return feature.geometry.type === 'Polygon';
});
```
This will provide an output stream of features that only contains polygons.

The second argument you can provide is a "mapping function". This function accepts one GeoJSON feature, and returns a "transformed" version of the feature. You can use this to adjust the features however you wish. For example:
```javascript
osm2geojsonstream = require("osm2geojsonstream")(null, function (feature) {
    return {
        type: "Feature",
        properties: {
            name: feature.properties.name.toLowerCase() || 'default name',
            transformedWith: 'osm2geojsonstream',
            originalProperties: feature.properties
        },
        geometry: feature.geometry    
    };
});
```
