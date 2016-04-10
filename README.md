# PhyCompBackEnd

##Installation
Requires node and therefore npm to be installed

Run 
```
npm install
npm install -g nodemon
```
                
then run with `npm start`

Requires you to have the database credentials set in your path

##API docs
To generate the API docs first you have to install [apidocsjs](http://apidocjs.com)

`npm install -g apidocs`

Then run `apidocs -i routes/ -o public/Docs` to generate the files needed.

##Testing
Unit testing is done using [Mochajs](http://mochajs.org) which you can install with `npm install -g mocha`
We also make use of [chaijs](http://chaijs.com) and the chaihttp plugin but these will be installed as dependencies.

To run the tests use `mocha`

##Database
We use mongodb for the database. When running the app as development or test you will need to have a database running locally. Once you have mongo installed run it with `mongod`

