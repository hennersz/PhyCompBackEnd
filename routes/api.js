var express = require('express');
var router = express.Router();

router.get('/all', function(req,res) {
  var db = req.db;
  var collection =db.get('pollution');
  var latitude = parseFloat(req.query.latitude);
  var longitude = parseFloat(req.query.longitude);
  var maxDistance = parseFloat(req.query.maxDist);

  if(isNaN(maxDistance)){
    res.render('apiError', {request: req.url, fix:"You didn't define a valid value for maxDist. Please add a number.<br>"}); 
  }
  collection.find({
    loc: { 
           $near : {
             $geometry: {type: "Point", coordinates: [longitude, latitude]},
             $maxDistance: maxDistance
           }
         }
  }).on('success', function(doc) {
    if(doc !== null){
      res.json(doc);
    }
    else{
      console.log("error");
      res.end();
    }
  });
});

router.get('/small', function(req, res) {
  var collection = req.db.get('pollution');
  
  collection.find({
    loc: { 
           $near : {
             $geometry: {type: "Point", coordinates: [-0.1275,51.5072]},
             $maxDistance: 1000
           }
         }
  },{fields: {data: 1, _id: 0}}, function(e, doc){
    console.log(doc);
    res.end();
  });

   
});
module.exports = router;
