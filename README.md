# PhyCompBackEnd

##Installation
Requires node and therefore npm to be installed

Run 
```
npm install
npm install -g nodemon
```

then start the app with `npm start`
This will need a mongo database running as described below.

##Database
We use [MongoDB](https://www.mongodb.org) for the database. When running the app as development or test you will need to have a database running locally. Once you have mongo installed run it with `mongod`. If you wish to use a database that isn't running on the default port or isn't running locally change the URI in \_config which is described below.

##_config.js
This config file is used to specify the database URIs for development, testing and production. It will look something like this: 
``` javascript
var config = {};

config.mongoURI = {
  development: 'localhost:27017/pollution',
  test: 'localhost:27017/test-data',
  production: process.env.DBUSER + ':' + process.env.DBPASS + '@ds055945.mlab.com:55945/pollution'
};

module.exports = config;
```
In our example we store the credentials for the production database as environment variables on the machine the app is running on.

it is then called in app.js in a similar way to here:
``` javascript
var config = require('./_config');
var monk = require('monk');
var db = monk(config.mongoURI[app.get('env')]);
```


##API docs
To generate the API docs first you have to install [apidocsjs](http://apidocjs.com)

`npm install -g apidocs`

Then run `apidocs -i routes/ -o public/Docs` to generate the files needed. This takes routes as the input directory and public/Docs as the output directory. 

##Testing
Unit testing is done using [Mochajs](http://mochajs.org) which you can install with `npm install -g mocha`
We also make use of [chaijs](http://chaijs.com) and the chaihttp plugin but these will be installed as dependencies.

To run the tests use `mocha`
Mocha will run all files in the test directory.



##Directory Structure
```
.
├── Procfile
├── README.md
├── _config.js
├── app
│   └── schema.js
├── app.js
├── bin
│   └── www
├── node_modules
├── package.json
├── public
│   ├── Docs
│   ├── images
│   ├── javascripts
│   │   └── maps.js
│   └── stylesheets
│       └── style.css
├── routes
│   ├── api.js
│   └── index.js
├── test
│   └── test-server.js
└── views
    ├── error.jade
    ├── index.jade
    ├── layout.jade
    └── map.jade

```

