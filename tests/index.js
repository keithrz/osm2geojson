var assert = require('assert'),
    osm2geojson = require('../'),
    geojsonStream = require('geojson-stream'),
    stream = require('stream'),
    fs = require('fs'),
    path = require('path'),
    errors = '',
    errLog = new stream.Writable();

errLog._write = function (chunk) { errors += chunk; };

describe('Osm2GeoJSON', function () {
  it('should return a function', function () {
    assert.equal('function', typeof osm2geojson);
  });
  describe(' when called', function () {
    var converter = osm2geojson()
      .on('error', errLog.write);
    it('is readable', function () {
      assert(converter.pipe);
    });
    it('is writable', function () {
      assert(converter.write && converter.end);
    });
    describe(', converts', function () {
      it('the correct number of features', function (done) {
        var xml = fs.createReadStream(path.join(__dirname, 'bejaia.osm')),
            features = [],
            parser = geojsonStream.parse()
              .on('data', features.push.bind(features))
              .on('end', function () {
                assert.equal(features.length, 1418);
                done();
              });
        xml.pipe(converter).pipe(parser);
      });
    });
  });
  describe('when called again, converts polygons', function () {
    var converter = osm2geojson()
      .on('error', errLog.write);

      it('following geojson spec', function (done) {
        var xml = fs.createReadStream(path.join(__dirname, 'polygon.osm')),
            parser = geojsonStream.parse()
              .on('data', function(data) {
                if(data.id === "100") {
                  assert.equal(data.geometry.type, 'Polygon');
                  assert.equal(data.geometry.coordinates.length, 1);
                  assert.equal(data.geometry.coordinates[0].length, 9);
                }
                if(data.id === "101") {
                  assert.equal(data.geometry.type, 'LineString');
                  assert.equal(data.geometry.coordinates.length, 7);
                }
              })
              .on('end', done);
        xml.pipe(converter).pipe(parser);
      });
  });
});