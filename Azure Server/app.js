var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var requestify = require('requestify');
var flag1 = 0;
var flag2 = 0;
var index = require('./routes/index');
var users = require('./routes/users');
var send = require('./routes/send');
var message_data,last_element;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


'use strict';

var EventHubClient = require('azure-event-hubs').Client;
var connectionString = "HostName=IotProject13067.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=LRreEWGMQajsowQDx51j5S81/MwBQ0ONcVSsXU14jvQ=";

var printError = function (err) {
  console.log(err.message);
};

var printMessage = function (message) {
  console.log('Message received: ');
  last_element = message.body[message.body.length - 1];
  for(var i = 0; i < message.body.length; i++) {
    var obj = message.body[i];
    console.log(obj.speed)
    if(obj.speed > 80 && flag1==0){
      console.log("overspeeding at " + obj.speed)
      requestify.post('http://localhost:3000/send', {
        message: 'Overspeeding alert: You were driving at a speed of ' + obj.speed + 'km/hr'
      }).then(function(response) {
        // Get the response body (JSON parsed or jQuery object for XMLs)
        response.getBody();
      });

      flag1 = 1;
    }

    if(obj.fuel_remaining < 50 && flag2 == 0){
      console.log("overspeeding at " + obj.speed)
      requestify.post('http://localhost:3000/send', {
        message: 'Low fuel remaining alert. Fuel remaining is' + obj.fuel_remaining + 'litre'
      }).then(function(response) {
        // Get the response body (JSON parsed or jQuery object for XMLs)
        response.getBody();
      });

      flag2 = 1;
    }
  }
  message_data = JSON.stringify(message.body);

  console.log(last_element);
  console.log('');
};

var client = EventHubClient.fromConnectionString(connectionString);
client.open()
    .then(client.getPartitionIds.bind(client))
    .then(function (partitionIds) {
      return partitionIds.map(function (partitionId) {
        return client.createReceiver('$Default', partitionId, { 'startAfterTime' : Date.now()}).then(function(receiver) {
          console.log('Created partition receiver: ' + partitionId)
          receiver.on('errorReceived', printError);
          receiver.on('message', printMessage);
        });
      });
    }).catch(printError);




app.use('/', index);
app.use('/users', users);
app.use('/send',send);

app.get('/data',function (req,res) {
  res.send(last_element);
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
