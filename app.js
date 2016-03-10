var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schema = require('./app/schema');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk(process.env.USER + ':' + process.env.PASS + '@ds055945.mlab.com:55945/pollution');
var collection = db.get('pollution');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var request = require('request');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
	req.db = db;
	next();
});

app.use('/', routes);
app.use('/users', users);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
   res.status(err.status || 500);
   res.render('error', {
     message: err.message,
     error: {}
   });
 });

// var test = db.get('devices');

// function addToDB(device){
//   if(device.data.sensors.length < 1){
//     return;

//   }
//   var deviceCollection = db.get('pollution');  
//   var deviceID = device.id;
//   var latitude = device.data.location.latitude;
//   var longitude = device.data.location.longitude;


//   var light = device.data.sensors[0].value;
//   var humidity = device.data.sensors[2].value;
//   var NO2 = device.data.sensors[4].value;
//   var CO = device.data.sensors[5].value;



//   var data = {deviceID:deviceID,
//                location:
//                  {
//                    latitude:latitude,
//                    longitude:longitude
//                  },
//                light:light,
//                humidity:humidity,
//                NO2: NO2,
//                CO: CO
//                };

//   deviceCollection.findOne({deviceID:deviceID}).on('success', function (doc) {
//     if(doc === null)
//     {
//       deviceCollection.insert(data);
//     }
//     else
//     {
//       deviceCollection.update({deviceID:deviceID},data);
//     }
//   }); 

// }

function convertCoords(latitude, longitude) {
  return {type:"Point", coordinates:[parseFloat(longitude), parseFloat(latitude)]};
}

function addToDB(data){
  var locObject = convertCoords(data.latitude, data.longitude);
  delete data.latitude;
  delete data.longitude;
  data.loc = locObject;
  
  collection.findOne({loc:locObject}).on('success', function(doc) {
    if(doc === null){
      collection.insert(data);
    }else{
      collection.update({loc:locObject}, data);
    }
  });
}

function getData(){

  var openair, intel, openaq;


  request('http://api.erg.kcl.ac.uk/AirQuality/Hourly/MonitoringIndex/GroupName=London/Json', function(error, response, body){
    if(!error && response.statusCode == 200) {
      obj = JSON.parse(body);
      openair = obj.HourlyAirQualityIndex;
      request('https://new-api.smartcitizen.me/v0/devices?near=51.5072,0.1275&per_page=500', function (error, response, body) {
       if (!error && response.statusCode == 200) {
         intel =  JSON.parse(body);
         request('https://api.openaq.org/v1/latest?city=London', function (error, response, body) {
          if(!error && response.statusCode == 200){
           openaq = JSON.parse(body);
           var result = schema.schema(openair,intel,openaq);
           // console.log(result);
           console.log(result.length);
           result.forEach(function(element, index){
             addToDB(element);
           });
           console.log("added results");
           collection.index({loc:"2dsphere"});
         }
       });
       }
     });
    }
  });

}


console.log('Running');
getData();
module.exports = app;
