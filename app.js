var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schema = require('./app/schema');
var config = require('./_config');

var mongo = require('mongodb');
var monk = require('monk');


var routes = require('./routes/index');
var api = require('./routes/api');

process.env.PWD = process.cwd();

var app = express();
app.use(express.static(path.join(process.env.PWD, 'public')));
app.use('/docs', express.static(path.join(process.env.PWD, 'public/Docs')));

var db = monk(config.mongoURI[app.get('env')]);
var collection = db.get('pollution');
app.db = db;

var request = require('request');

// view engine setup
app.set('views', path.join(process.env.PWD, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(process.env.PWD, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req,res,next){
	req.db = db;
	next();
});

app.use('/', routes);
app.use('/api', api);

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
    if(err.json){ //if the error occured during api call send response as json
      res.json({
        'status': err.status,
        'message': err.message,
      });
    }else{ //send as html page
      res.render('error', {
        message: err.message,
        error: err
      });
    }
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
   if(err.json){ //if the error occured during api call send response as json
     res.json({
       'status': res.status,
       'message': err.message,
     });
   }else{ //send as html page
     res.render('error', {
       message: err.message,
       error: {}
     });
   }
 });

app.convertCoords = function convertCoords(latitude, longitude) {
  return {type:"Point", coordinates:[parseFloat(longitude), parseFloat(latitude)]};
}

app.addToDB = function addToDB(data){
  var locObject = app.convertCoords(data.latitude, data.longitude);
  delete data.latitude;
  delete data.longitude;
  data.loc = locObject;
  
  collection.findOne({loc:locObject}).on('success', function(doc) { //checks if document is already in as all locations are unique and don't change 
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
    if (!error && response.statusCode == 200) {
      obj = JSON.parse(body);
      openair = obj.HourlyAirQualityIndex;
      request('https://new-api.smartcitizen.me/v0/devices?near=51.5072,0.1275&per_page=500', function (error, response, body) {
       if (!error && response.statusCode == 200) {
         intel =  JSON.parse(body);
         request('https://api.openaq.org/v1/latest?city=London', function (error, response, body) {
          if (!error && response.statusCode == 200){
            openaq = JSON.parse(body);
            var result = schema.schema(openair,intel,openaq);
            // console.log(result);
            console.log(result.length);

            result.forEach(function(element, index){
              app.addToDB(element);
            });
            console.log("added results");
            collection.index({loc:"2dsphere"});
            console.log("Created Index");
         }
       });
       }
     });
    }
  });
}

console.log('Running');
getData();
setInterval(getData, 600000);
module.exports = app;
