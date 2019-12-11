const express = require('express');
const session = require('express-session');

LIFE = 1000*60*60*2
const {
  PORT = 3050,
  NODE_ENV = "development",

  SESSION_NAME = 'sid',
  SESSION_SECRET = 'belehbelhbel4ehsjafy',
  SESSION_LIFETIME = LIFE
} = process.env

const IN_PROD = NODE_ENV === 'production'

const app = express();

app.use(session({
    name: SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie:{
      maxAge: SESSION_LIFETIME,
      sameSite: true,
      secure: IN_PROD,
      filterParameter : JSON.stringify({}),
      sortParameter : JSON.stringify({}),
      set_status : 0,
      ascFlag : 0,
      descFlag : 0
    }
}))

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

app.get('/', (req, res) => {
  res.render('admin.ejs', { adError: '', adSuccess: '' });
});

// Start server to listen to the port
app.listen(config.get('server.port'), () => {
  console.log(
    `[Server running on ${config.get('server.host')}:${config.get(
      'server.port'
    )}]`
  );
});
