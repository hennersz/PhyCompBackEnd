var express = require('express');
var router = express.Router();
/**
 * This is a comment
 * @api {get} /api/all Request all pollution data 
 * @apiName GetAllData
 * @apiGroup pollution
 *
 * @apiParam {Number} latitiude The latitude of the point you want to get data near to
 * @apiParam {Number} longitude The longitude of the point you want to get data near to
 * @apiParam {Number} maxDist The maximum distance from the specified point you want data from
 *
 * @apiSuccess {String} _id Mongo ID of the device
 * @apiSuccess {String} deviceID Smart citizen devce ID 
 * @apiSuccess {String} location London air location
 * @apiSuccess {String} siteName OpenAQ site name
 * @apiSuccess {String} datetime The time the sensor was updated
 * @apiSuccess {Object[]} data An array of data objects
 * @apiSuccess {Object} loc A geoJSON location object
 *
 * @apiSuccessExample Success-Response
 *    HTTP/1.1 200 OK
 *    {
 *      "_id":"56fab1838d45e3a41ac1795d",
 *      "deviceID":2276,
 *      "datetime":"2015-07-15T10:52:14Z",
 *      "data":[
 *        {"no2":1},
 *        {"co":1}
 *      ],
 *      "loc":{
 *        "type":"Point",
 *        "coordinates":[-0.127758299999982,51.5073509]
 *      }
 *    }
 *
 */
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
