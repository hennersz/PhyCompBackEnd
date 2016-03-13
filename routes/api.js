var express = require('express');
var router = express.Router();

router.get('/test', function(req,res) {
  var db = req.db;
  var collection =db.get('pollution');
  var latitude = parseFloat(req.query.latitude);
  var longitude = parseFloat(req.query.longitude);
  var maxDistance = parseFloat(req.query.maxDist);
  console.log(latitude);
  console.log(longitude);
  collection.find({
    loc: { $near : 
           {
             $geometry: {type: "Point", coordinates: [longitude, latitude]},
             $maxDistance: maxDistance
           }
    }
  }).on('success', function(doc) {
    if(doc !== null){
      console.log(doc[0]);
      res.end(JSON.stringify(doc));
    }
    else{
      console.log("error");
      res.end();
    }
  });
});

module.exports = router;
