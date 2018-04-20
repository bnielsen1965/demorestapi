const MongoClient = require('mongodb').MongoClient;

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
  // assume user provides $gte date string in URL query parameters
  let gteDate = new Date(req.query.$gte);

  // create MongoDB client connection
  MongoClient.connect(mongoUrl)
  .then(client => {
    // collection in database
  	let database = client.db(dbName);
  	let records = database.collection('records');

    // query documents with Joined date greater than or equal to the date object
    return records.find({ Joined: { $gte: gteDate } }).toArray();
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
