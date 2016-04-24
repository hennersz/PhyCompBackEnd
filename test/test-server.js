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
      });
    done();
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
      });
    done();
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
      });
    done();
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
      });
    done();
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
      });
    done();
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
      });
    done();
  });
});
