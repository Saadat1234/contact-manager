var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Boom = require('boom');



const contactsRouter = require('./routes/contacts');
const addressesRouter = require('./routes/addresses');
const usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/contacts', contactsRouter);
app.use('/api/v1/addresses', addressesRouter);
app.use('/api/v1/users', usersRouter);

// Catch undefined routes
app.use((req, res, next) => {
  next(Boom.notFound(`Sorry, cannot find: ${req.path}`));
});

// Generic error handler
app.use((err, req, res) => {
  let status, message;
  if(err.output){
    status = err.output.statusCode;
    message = err.output.payload;
  } else {
    status = err.status || 500;
    message = {
      message: err.message || 'Oops, something bad happened'
    };
  }

  res
    .status(status)
    .json(message);
});

module.exports = app;
