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
      "deviceID":2276,
      "datetime":"2015-09-05T20:11:40Z",
      "data":[{"no2":1},{"co":1}],
      "loc":{"type":"Point","coordinates":[-0.127758299999982,51.5073509]}
    }
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
        res.body[0].should.have.property('deviceID');
        res.body[0].should.have.property('datetime');
        res.body[0].should.have.property('data');
        res.body[0].should.have.property('loc');
        res.body[0].data[0].should.have.property('no2');
        res.body[0].data[1].should.have.property('co');
        res.body[0].loc.should.have.property('type');
        res.body[0].loc.should.have.property('coordinates');
        //checking object values are correct
        
        done();
      });
  });
});
