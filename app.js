const express = require('express');
const app = express();

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

app.get('/', function(req, res) {
  res.render('index', { title: 'Home Page' });
});

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// index page
app.get('/', function(req, res) {
  res.render('index');
});

// middleware
app.use(express.json());

const authCandidate = require('./routes/auth');
app.use('/api/candidate', authCandidate);

app.listen(8000, () => console.log('Server up and running'));
