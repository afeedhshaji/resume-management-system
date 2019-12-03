const express = require('express');
const app = express();

//For parsing directories
const path = require('path');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//Template engine
//app.set('view engine', 'jade'); 

app.listen(3000, () => console.log('Server up and running'));
