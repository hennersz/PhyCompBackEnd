process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var monk = require('monk');

var server = require('../app.js');

var should = chai.should();
chai.use(chaiHttp);


describe('API', function() {

  var collection = server.db.get('pollution');
  var a = {
    "_id":"56fab1838d45e3a41ac1795d",
    "deviceID":2276,
    "datetime":null,
    "data":[{"no2":1},{"co":1}],
    "loc":{"type":"Point","coordinates":[-0.127758299999982,51.5073509]}
  }; 
  beforeEach(function(done){
    collection.insert(a);
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
        done();
      });
  });
});
