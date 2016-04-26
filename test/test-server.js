process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var monk = require('monk');

var testData = require('./test-data.js');

var server = require('../app.js');

var should = chai.should();
chai.use(chaiHttp);


describe('API', function() {

  var collection = server.db.get('pollution');
  before(function(done){
    for(i in testData)
    {
      collection.insert(testData[i]);
    }
    collection.index({loc:"2dsphere"}).on('complete', function(err){done()});
  });
  after(function(done){
    collection.drop();
    done();
  });
  
  it('should list all datapoints on /api/all', function(done) {
    chai.request(server)
      .get('/api/all')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.should.have.lengthOf(3);
        done();
      });
  });
  it('should list all datapoints in distance order on /api/all/near', function(done) {
    chai.request(server)
      .get('/api/all/near?latitude=51.5073&longitude=-0.1276&maxDist=60000')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.should.have.lengthOf(3);
        done();
      });
  });
  it('should fail on missing parameter latitude on /api/all/near', function(done) {
    chai.request(server)
      .get('/api/all/near?latitiude=&longitude=-0.1276&maxDist=60000')
      .end(function(err, res) {
        res.should.have.status(400);
        res.should.be.json;
      });
    chai.request(server)
      .get('/api/all/near?latitiude=51.1234&longitude=&maxDist=60000')
      .end(function(err, res) {
        res.should.have.status(400);
        res.should.be.json;
      });
    chai.request(server)
      .get('/api/all/near?latitiude=51.1234&longitude=-0.1276&maxDist=')
      .end(function(err, res) {
        res.should.have.status(400);
        res.should.be.json;
        done();
      });
  });
  it('should fail on out of range parameter values on /api/all/near', function(done) {
    chai.request(server)
      .get('/api/all/near?latitiude=300&longitude=-0.1276&maxDist=5000')
      .end(function(err, res) {
        res.should.have.status(400);
        res.should.be.json;
      });
    chai.request(server)
      .get('/api/all/near?latitiude=-300&longitude=-0.1276&maxDist=5000')
      .end(function(err, res) {
        res.should.have.status(400);
        res.should.be.json;
      });
    chai.request(server)
      .get('/api/all/near?latitiude=80&longitude=-999.1276&maxDist=5000')
      .end(function(err, res) {
        res.should.have.status(400);
        res.should.be.json;
      });
    chai.request(server)
      .get('/api/all/near?latitiude=80&longitude=999.1276&maxDist=5000')
      .end(function(err, res) {
        res.should.have.status(400);
        res.should.be.json;
      });
    chai.request(server)
      .get('/api/all/near?latitiude=80&longitude=9.1276&maxDist=-5000')
      .end(function(err, res) {
        res.should.have.status(400);
        res.should.be.json;
        done();
      });
  });
  it('should give nearest value for all data types on /api/small', function(done) {
    chai.request(server)
      .get('/api/small?latitude=51.5072&longitude=-0.175')
      .end(function(err,res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('no2');
        res.body.should.have.property('co');
        res.body.should.have.property('o3');
        res.body.should.have.property('pm10');
        res.body.should.have.property('so2');
        res.body.should.have.property('pm25');
        res.body.should.have.property('light');
        res.body.should.have.property('noise');
        done();
      });
  });
  it('should give values for the specified properties', function(done) {
    chai.request(server)
      .get('/api/small?latitude=51.5072&longitude=-0.175&dataTypes=no2,co')
      .end(function(err,res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('no2');
        res.body.should.have.property('co');
        res.body.should.not.have.property('pm10');
        done();
      });
  });
  it('should give smaller response for sinle data type', function(done) {
    chai.request(server)
      .get('/api/small?latitude=51.5072&longitude=-0.175&dataTypes=no2')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('value');
        res.body.should.have.property('units');
        res.body.should.have.property('raw_value');
        res.body.should.have.property('raw_units');
        done();
      });
  });
  it('should error on out of bounds properties', function(done) {
    chai.request(server)
      .get('/api/small?latitude=5738734&longitude=0')
      .end(function(err, res) {
        res.should.have.status(400);
        res.should.be.json;
      });
    chai.request(server)
      .get('/api/small?latitude=-5738734&longitude=0')
      .end(function(err, res) {
        res.should.have.status(400);
        res.should.be.json;
      });
    chai.request(server)
      .get('/api/small?latitude=0&longitude=23409')
      .end(function(err, res) {
        res.should.have.status(400);
        res.should.be.json;
      });
    chai.request(server)
      .get('/api/small?latitude=0&longitude=-2349234')
      .end(function(err, res) {
        res.should.have.status(400);
        res.should.be.json;
        done();
      });
  });
});

describe('Database insertion code', function(){
  
  var collection = server.db.get('pollution');
  before(function(done){
    for(i in testData)
    {
      collection.insert(testData[i]);
    }
    collection.index({loc:"2dsphere"}).on('complete', function(err){done()});
  });
  after(function(done){
    collection.drop();
    done();
  });

  it('should convert lat and long values to geoJSON point', function(done) {
    var result = server.convertCoords('1.2345', '-9.87654');
    result.should.have.property('type', 'Point');
    result.should.have.deep.property('coordinates[0]', -9.87654);
    result.should.have.deep.property('coordinates[1]', 1.2345);
    done();
  });

  it('should correctly insert and update entries in database', function(done) {
    var data1 = {
      "datetime":"2015-03-25T20:00:38Z",
      "data":{
        "no2":{
          "value":2,
          "units":"AirQualityIndex",
          "raw_value":0.01264,
          "raw_units":"ppm"
        },
        "co":{
          "value":1,
          "units":"AirQualityIndex",
          "raw_value":1.97912,
          "raw_units":"ppm"
        },
        "light":{
          "value":55.4,
          "units":"Lux",
          "raw_value":55.4,
          "raw_units":"Lux"
        },
        "noise":{
          "value":50,
          "units":"dB",
          "raw_value":50,
          "raw_units":"dB"
        },
        "so2":null,
        "o3":null,
        "pm10":null,
        "pm25":null,
      },
      "latitude":"51.5073509",
      "longitude":"-0.127758299999982" 
    };

    server.addToDB(data1);
    result = collection.find({}).on('success', function(doc){
      doc.should.be.a('array');
      doc.should.have.lengthOf(3);
      done();
    })
  });
});
