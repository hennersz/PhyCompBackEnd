var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) 
{
  res.render('index', { title: 'City Data Visualiser' });
});

router.get('/map', function(req, res, next)
{
  var collection = req.db.get('pollution');
  collection.find({
    loc: { 
           $near : {
             $geometry: {type: "Point", coordinates: [-0.1275,51.5072]},
             $maxDistance: 35000
           }
         }
  }, function(e,doc){
    res.render('map', {title: 'Points map', data: doc});
  });
});

module.exports = router;
