var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/**
 * appel du modul mongoose
 */
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var restaurantsRoute = require('./routes/restaurants');
var mealsRoute = require('./routes/meals');

/**
 * appel des model pour le mapping
 */
require('./models/restaurant'); 
require('./models/meals');


var app = express();
/**
 * appel de la connection mongodb
 */
mongoose.connect('mongodb://localhost:27017/NoYelp');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * appel des routes
 */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/restaurants', restaurantsRoute);
app.use('/meals', mealsRoute);

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
