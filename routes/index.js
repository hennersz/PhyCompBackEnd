var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) 
{
  res.render('index', { title: 'City Data Visualiser' });
});

router.get('/api', function(req,res) {
  var db = req.db;
  var collection =db.get('pollution');
  var latitude = parseFloat(req.query.latitude);
  var longitude = parseFloat(req.query.longitude);
  console.log(latitude);
  console.log(longitude);
  collection.find({
    loc: { $near : 
           {
             $geometry: {type: "Point", coordinates: [longitude, latitude]},
           }
    }
  }).on('success', function(doc) {
    if(doc !== null){
      console.log(doc[0]);
      res.end(JSON.stringify(doc));
    }
    else{
      console.log("error");
    }
  });
});

module.exports = router;
