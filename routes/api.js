var express = require('express');
var router = express.Router();

/**
* @api {get} /api/all 1. Request all pollution data
* @apiName GetAllData
* @apiGroup pollution
* @apiVersion 0.1.0
*
* @apiSuccess {String} _id Mongo ID of the device
* @apiSuccess {String} datetime The time the sensor was updated
* @apiSuccess {Object} data An object containing sensor data
* @apiSuccess {Object} loc A geoJSON location object
* @apiExample {curl} Example usage:
*    curl -i http://localhost/api/all
*    
* @apiSuccessExample Success-Response
*    HTTP/1.1 200 OK
*    [
*      {
*        "_id":"56fab1838d45e3a41ac1795d",
*        "datetime":"2015-07-15T10:52:14Z",
*        "data":{
*          "no2":{"value":1,"units":"AirQualityIndex","raw_value":0.27176,"raw_units":"ppm"},
*          "co":{"value":1,"units":"AirQualityIndex","raw_value":6.1601333333333335,"raw_units":"ppm"},
*          "light":{"value":49.8,"units":"Lux","raw_value":49.8,"raw_units":"Lux"},
*          "noise":{"value":50,"units":"dB","raw_value":50,"raw_units":"dB"},
*          "so2":null,
*          "o3":null,
*          "pm10":null,
*          "pm25":null
*        },
*       "loc":{
*          "type":"Point",
*          "coordinates":[-0.127758299999982,51.5073509]
*        }
*      }
*    ]
*  
*/

router.get('/all', function(req,res,next) {
  var db = req.db;
  var collection = db.get('pollution');

  collection.find({}).on('success', function(doc) {
    res.json(doc);
  }).on('error', function(err) {
    next(err);
  })
})
/**
 * @api {get} /api/all/near 2. Request all pollution data near a point within a certain distance
 * @apiName GetAllDataNear
 * @apiGroup pollution
 * @apiVersion 0.1.0
 *
 * @apiParam {Number{-90-90}} latitiude The latitude of the point you want to get data near to
 * @apiParam {Numberi{-180-180}} longitude The longitude of the point you want to get data near to
 * @apiParam {Number{0-...}} maxDist The maximum distance from the specified point you want data from
 *
 * @apiSuccess {String} _id Mongo ID of the device
 * @apiSuccess {String} datetime The time the sensor was updated
 * @apiSuccess {Object} data An object containing sensor data
 * @apiSuccess {Object} loc A geoJSON location object
 *
 * @apiExample {curl} Example usage:
 *    curl -i http://localhost/api/all/near?latitude=51.5073&longitude=-0.1276&maxDist=2000
 *    
 * @apiSuccessExample Success-Response
 *    HTTP/1.1 200 OK
 *    [
 *      {
 *        "_id":"56fab1838d45e3a41ac1795d",
 *        "datetime":"2015-07-15T10:52:14Z",
 *        "data":{
 *          "no2":{"value":1,"units":"AirQualityIndex","raw_value":0.27176,"raw_units":"ppm"},
 *          "co":{"value":1,"units":"AirQualityIndex","raw_value":6.1601333333333335,"raw_units":"ppm"},
 *          "light":{"value":49.8,"units":"Lux","raw_value":49.8,"raw_units":"Lux"},
 *          "noise":{"value":50,"units":"dB","raw_value":50,"raw_units":"dB"},
 *          "so2":null,
 *          "o3":null,
 *          "pm10":null,
 *          "pm25":null
 *        },
 *       "loc":{
 *          "type":"Point",
 *          "coordinates":[-0.127758299999982,51.5073509]
 *        }
 *      }
 *    ]
 *
 * @apiErrorExample {json} Bad request parameters:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "status": 400,
 *      "message": "Bad request - Parameters incorrectly formatted"
 *    }
 * 
 */
router.get('/all/near', function(req,res, next) {
  var db = req.db;
  var collection =db.get('pollution');
  var latitude = parseFloat(req.query.latitude);
  var longitude = parseFloat(req.query.longitude);
  var maxDistance = parseFloat(req.query.maxDist);

  if(isNaN(maxDistance) || maxDistance < 0 ||
     isNaN(latitude) || latitude < -90 || latitude > 90 ||
     isNaN(longitude) || longitude < -180 || longitude > 180){
    var err = new Error('Bad request - Parameters incorrectly formatted');
    err.status = 400;
    err.json = true;
    return next(err); //return to end function
  };
  collection.find({
    loc: { 
           $near : {
             $geometry: {type: "Point", coordinates: [longitude, latitude]},
             $maxDistance: maxDistance
           }
         }
  }).on('success', function(doc) {
    res.json(doc);
  }).on('error', function(err) {
    return next(err);
  });
});

function contains(value, array){
  var retVal = false;
  array.forEach(function(element, index, list){
    if(element == value){
      retVal = true;
    }
  });
  return retVal;
}

router.get('/small', function(req, res, next) {
  var collection = req.db.get('pollution');
  var validDataTypes = ['no2', 'co', 'light', 'noise', 'so2', 'o3', 'pm10', 'pm25']; 

  var latitude = parseFloat(req.query.latitude);
  var longitude = parseFloat(req.query.longitude);
  var dataTypes = req.query.dataTypes.split(',');
  for(i in dataTypes){
    if(!contains(dataTypes[i], validDataTypes)){
      var err = new Error('Bad request');
      err.status = 400;
      err.json = true;
      return next(err); //return to end function
    }
  };
  collection.find({
    loc: { 
           $near : {
             $geometry: {type: "Point", coordinates: [-0.1275,51.5072]},
           }
         }
  }).on('success', function(doc){
    var response = {};
    for(i in dataTypes){
      for(j in doc){
        if(doc[j].data[dataTypes[i]] !== null)
        {
          response[dataTypes[i]] = doc[j].data[dataTypes[i]];
          break;
        }
      }
    }
    res.json(response);
  }).on('error', function(err){
    return next(err);
  });
});
module.exports = router;
