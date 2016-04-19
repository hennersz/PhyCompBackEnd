process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var monk = require('monk');

var server = require('../app.js');

var should = chai.should();
chai.use(chaiHttp);


describe('API', function() {

  var collection = server.db.get('pollution');
  var testData = [
    {
      "_id":"5702b14be4b4872d5d92b50b",
      "datetime":"2015-03-25T20:00:38Z",
      "data":[
        {
          "no2":{
            "value":1,
            "units":"AirQualityIndex",
            "raw_value":0.01264,
            "raw_units":"ppm"
          }
        },
        {
          "co":{
            "value":1,
            "units":"AirQualityIndex",
            "raw_value":1.97912,
            "raw_units":"ppm"
          }
        },
        {
          "light":{
            "value":55.4,
            "units":"Lux",
            "raw_value":55.4,
            "raw_units":"Lux"
          }
        },
        {
          "noise":{
            "value":50,
            "units":"dB",
            "raw_value":50,
            "raw_units":"dB"
          }
        },
        {"no2":null},
        {"so2":null},
        {"o3":null},
        {"pm10":null},
        {"pm25":null},
        {"co":null},
        {"light":null},
        {"noise":null}],"loc":{"type":"Point","coordinates":[-0.127758299999982,51.5073509]}}
  ]; 
  beforeEach(function(done){
    for(i in testData)
    {
      collection.insert(testData[i]);
    }
    collection.index({loc:"2dsphere"}).on('complete', function(err){done()});
  });
  afterEach(function(done){
    collection.drop();
    done();
  });
  
  it('should list all datapoints on /api/all', function(done) {
    chai.request(server)
      .get('/api/all?latitude=51.5073&longitude=-0.1276&maxDist=200')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        //checking that object has correct properties
        res.body[0].should.have.property('_id');
        res.body[0].should.have.property('datetime');
        res.body[0].should.have.property('data');
        res.body[0].should.have.property('loc');
        res.body[0].loc.should.have.property('type');
        res.body[0].loc.should.have.property('coordinates');
        //checking object values are correct
        
        done();
      });
  });
});
