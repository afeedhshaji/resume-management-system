const express = require('express');
const app = express();

const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

mongoose
  .connect(process.env.DB_CONNECT, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log('Now connected to MongoDB!'))
  .catch(err => console.error(`Something went wrong ${err}`));

// For parsing directories
const path = require('path');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// Template engine - temp
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  res.render('index', { title: 'Home Page' });
});

// middleware
app.use(express.json());

const authUser = require('./routes/auth');
app.use('/api/user', authUser);

app.listen(5000, () => console.log('Server up and running'));
