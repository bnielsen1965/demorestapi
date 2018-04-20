const MongoClient = require('mongodb').MongoClient;
const MongoStringTo = require('mongo-stringto');

// database connection URL with authentication credentials
const dbHost = '192.168.124.100';
const dbPort = 27017;
const dbUsername = 'test';
const dbPassword = 'test';
const dbName = 'test';
const mongoUrl = 'mongodb://' + dbUsername + ':' + dbPassword + '@' + dbHost + ':' + dbPort + '/' + dbName;

// modules and settings for expressjs REST server
const Express = require("express");
const restPort = 3000;

// create expressjs server
let restAPI = Express();

// define a REST API route to run our database query
restAPI.get("/records/", (req, res) => {
  // declare the query variable for scope
  let query;

  // transform the query passed in the API request
  MongoStringTo.transformQuery(req.query)
  .then(tfQuery => {
    // save transformed query into the scoped variable
    query = tfQuery;

    // create MongoDB client connection
    return MongoClient.connect(mongoUrl);
  })
  .then(client => {
    // collection in database
  	let database = client.db(dbName);
  	let records = database.collection('records');

    // execute the query
    return records.find(query).toArray();
  })
  .then(docs => {
    // send REST API response
    res.status(200).send(docs);
  })
  .catch(err => {
    // respond with error
    res.status(500).send(err);
  });
});

// start the REST API server
let server = restAPI.listen(restPort, function () {
  console.log("REST API running on port.", server.address().port);
});
