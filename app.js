if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
// console.log(process.env);
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./model/user.js');

const listingRout = require('./routes/listing.js');
const reviewRout = require('./routes/review.js');
const userRout = require('./routes/user.js');

// const Mongo_url = 'mongodb://127.0.0.1:27017/blissfulWander';
const dbUrl = process.env.ATLASDB_URL; //this is atlas db

main()
  .then(() => {
    console.log('connected to DB');
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate); //ejs mate
app.use(express.static(path.join(__dirname, 'public')));

//this is mongo-session
const store = MongoStore.create({
  mongoUrl: dbUrl,
  //options
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600, //24 hour after session update
});

//if come error
store.on('error', () => {
  console.log('ERROR IN MONGO-SESSION STORE', err);
});
//this is express-session options
const sessionOption = {
  store: store, //pass this mongo-session store information
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOny: true,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

//check npm -> passport-local-mongoose
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this is flash middelwere
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});

app.get('/', (req, res) => {
  res.redirect('/listings');
});

app.use('/listings', listingRout); //use for routes-> listings.js
app.use('/listings/:id/reviews', reviewRout); //use for routes-> listings.js
app.use('/', userRout);

app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page not found!'));
});

// Error-handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).render('error.ejs', { message });
});

app.listen(8080, () => {
  console.log('server is start in port 8080');
});

// app.get('/testlisting', (req, res) => {
//   let sampleListing = new Listing({
//     title: 'home',
//     description: 'By the new',
//     price: 12200,
//     location: 'Surat',
//     country: 'USA',
//   });
//   sampleListing
//     .save()
//     .then(() => console.log('image is save'))
//     .catch((err) => console.log(err));
// });
