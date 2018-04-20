
const MongoClient = require('mongodb').MongoClient;

// database connection URL with authentication credentials
const dbHost = '192.168.124.100';
const dbPort = 27017;
const dbUsername = 'test';
const dbPassword = 'test';
const dbName = 'test';
const mongoUrl = 'mongodb://' + dbUsername + ':' + dbPassword + '@' + dbHost + ':' + dbPort + '/' + dbName;

// data used to create new documents
const data = [
  { Name: 'Bob', Group: 'Music', Joined: new Date('2010-07-13T18:47:33.000Z') },
  { Name: 'Mary', Group: 'Cars', Joined: new Date('2012-11-01T12:23:13.000Z') },
  { Name: 'Steve', Group: 'Music', Joined: new Date('2012-04-20T07:17:30.000Z') },
  { Name: 'Jane', Group: 'News', Joined: new Date('2015-09-13T21:04:43.000Z') },
  { Name: 'Kim', Group: 'Cars', Joined: new Date('2015-10-18T11:07:03.000Z') },
];

// create client connection
MongoClient.connect(mongoUrl)
.then(client => {
  // create collection in database
	let database = client.db(dbName);
	let records = database.collection('records');

  // insert documents into the collection
  return loadData(records, data);
})
.then(() => {
  console.log('Complete');
  process.exit(0);
})
.catch(err => {
  console.log(err, err.stack);
  process.exit(1);
});


// a function to help load an array of data into the collection
function loadData(collection, data) {
  return new Promise((resolve, reject) => {
    let loader = (i) => {
      // check if loader has ran out of data
      if (i >= data.length) {
        resolve();
        return;
      }

      // load the selected document data
      collection.insert(data[i])
      .then(doc => {
        // increment and load next data point
        loader(i + 1);
      })
      .catch(err => {
        reject(err);
      });
    }

    // start loading data
    loader(0);
  });
}
