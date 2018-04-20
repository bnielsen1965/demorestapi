const MongoClient = require('mongodb').MongoClient;

// database connection URL with authentication credentials
const dbHost = '192.168.124.100';
const dbPort = 27017;
const dbUsername = 'test';
const dbPassword = 'test';
const dbName = 'test';
const mongoUrl = 'mongodb://' + dbUsername + ':' + dbPassword + '@' + dbHost + ':' + dbPort + '/' + dbName;

// declare global variables
let database, records;

let dateString = '2015-01-01T00:00:00.000Z';
let dateObject = new Date(dateString);

// create client connection
MongoClient.connect(mongoUrl)
.then(client => {
  // collection in database
	database = client.db(dbName);
	records = database.collection('records');

  // query documents with Joined date greater than or equal to the date object
  return records.find({ Joined: { $gte: dateObject } }).toArray();
})
.then(docs => {
  console.log('Documents matching query with Date object: ', docs.length);

  // query documents with Joined date greater than or equal to the date string
  return records.find({ Joined: { $gte: dateString } }).toArray();
})
.then(docs => {
  console.log('Documents matching query with Date string: ', docs.length);
})
.then(() => {
  console.log('Complete');
  process.exit(0);
})
.catch(err => {
  console.log(err, err.stack);
  process.exit(1);
});
