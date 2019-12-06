const express = require('express');
const app = express();

const config = require('config');

const path = require('path');

const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

// connect to db
mongoose
  .connect(process.env.DB_CONNECT, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log('Now connected to MongoDB!'))
  .catch(err => console.error(`Something went wrong ${err}`));

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const authCandidate = require('./routes/auth');
app.use('/api/candidate', authCandidate);

const updateCandidate = require('./routes/update');
app.use('/api/candidate', updateCandidate);

const autocompleteCandidate = require('./routes/autocomplete');
app.use('/api/candidate', autocompleteCandidate);

// Start server to listen to the port
app.listen(config.get('server.port'), () => {
  console.log(
    `[Server running on ${config.get('server.host')}:${config.get(
      'server.port'
    )}]`
  );
});
