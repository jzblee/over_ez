const createError = require('http-errors');
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

const db = require('./schema');
const indexRouter = require('./routes/index');
var functions = require('./helpers/authFunctions.js');

const app = express();
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'oobleck',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use('local', new LocalStrategy(
  function(username, password, done) {
    functions.authHash(bcrypt, username, password, db, function(err, db_user, match) {
      if (err) { return done(err); }
      if (match) { return done(null, db_user); }
      return done(null, false);
    });
  }
));

// TODO: username validation
passport.use('local-signup', new LocalStrategy(
  {passReqToCallback: true},
  function(req, username, password, done) {
    db.User.findOne({ username: username }, function (err, db_user) {
      if (err) return done(err);
      if (db_user) return done(null, false, { message: 'user already exists' });
      functions.createHash(bcrypt, username, password, db, function(err, hash) {
        if (err) return done(err);
        let newUser = new db.User({
          username: username,
          password: hash
        });
        newUser.save(function(err) {
          if (err) {
            done([500, "Failed to save new user: " + err.message]);
          } else {
            done(null, newUser);
          }
        });
      });
    });
  }
));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
