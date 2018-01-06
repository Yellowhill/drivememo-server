import mongoose from 'mongoose';
import mongodbErrorHandler from 'mongoose-mongodb-errors';

// import environmental variables from our variables.env file
require('dotenv').config({ path: './variables.env' });


// Connect to our Database and handle an bad connections
mongoose.connect(process.env.DATABASE, {
    useMongoClient: true
  });
  mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
  mongoose.connection.on('error', (err) => {
    console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
  });

  mongoose.plugin(mongodbErrorHandler);
//import all of our models
import './models/drivememo.model.js';
import './models/cardDriveAss.model.js';
import './models/cashDriveAss.model.js';
import './models/invoiceDriveAss.model.js';
import './models/user.model.js';

import app from './server.js';
app.set('port', process.env.PORT || 4000);
const server = app.listen(app.get('port'), ()=> {
    console.log(`Express runnig on port ${server.address().port}` );
});

