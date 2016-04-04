var config = {};

config.mongoURI = {
  development: 'localhost:27017/pollution',
  test: 'localhost:27017/test-data',
  production: process.env.DBUSER + ':' + process.env.DBPASS + '@ds055945.mlab.com:55945/pollution'
};

module.exports = config;
