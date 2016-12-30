'use strict';

var clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
var Message = require('azure-iot-device').Message;
var Converter = require("csvtojson").Converter;
var path = require('path');
var converter = new Converter({});
var fs = require('fs');
var flag = 0;
var result
var connectionString = 'HostName=IotProject13067.azure-devices.net;DeviceId=myFirstNodeDevice;SharedAccessKey=OXg3/tWUBkTFQj2oSZnJUT+AYPKclY1l+e5Wgyk5vMc=';

converter.on("end_parsed", function (jsonArray) {
   console.log(jsonArray);
   result = jsonArray //here is your result jsonarray 
   var data = JSON.stringify(result);
  var message = new Message(data);
  console.log("Sending message: " + message.getData());
  client.sendEvent(message, printResultFor('send'));
  var currentPath = path.resolve("./", "test.csv");
  var newPath = path.resolve("./Archived/", "test.csv");
});

var client = clientFromConnectionString(connectionString);
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}


fs.watch('./', function (event, filename) {
    console.log('event is: ' + event);
    if (filename) {
        console.log('filename provided: ' + filename);
        if(filename =="test.csv")
        {
          console.log('Read file');
          flag =1;
        }
    } else {
        console.log('filename not provided');
    }

  });


  var connectCallback = function (err) {
    if (err) {
      console.log('Could not connect: ' + err);
    } else {
    console.log('Client connected');

    // Create a message and send it to the IoT Hub every second
    setInterval(function(){
        
        //var windSpeed = 10 + (Math.random() * 4);
        if(flag ==1 )
        {
          
          fs.createReadStream("./test.csv").pipe(converter);
          flag = 0;

          
          //fs.renameSync(currentPath, newPath);
          //fs.truncate(currentPath, 0, function(){console.log('Data uploaded and file truncated')});
          
          
        }
        else
        {
          console.log('Waiting for new data');
        }
    }, 4000);
  }
};

client.open(connectCallback);

