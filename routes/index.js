var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) 
{
  res.render('index', { title: 'Express' });
});

router.get('/helloworld', function(req, res)
{
	res.render('helloworld', {title: 'Hello, World' });
});

router.get('/userlist', function(req,res) {
	var db = req.db;
	var collection = db.get('usercollection');
	collection.find({},{},function(e,docs){
		res.render('userlist', {
			"userlist" : docs
		});
	});
});

router.get('/newuser', function(req,res) {
	res.render('newuser', {title:'Add New User'});
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


router.post('/adduser', function(req,res) {

	var db = req.db;

	var userName = req.body.username;
	var userEmail = req.body.useremail;

	var collection = db.get('usercollection');

	collection.insert({
		"username" : userName,
		"email" : userEmail
	}, function (err,doc) {
		if (err) {
			res.send("There was a problem adding the information to the database.");
		}
		else {
			res.redirect("userlist");
		}
	});
});

module.exports = router;
