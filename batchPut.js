var awsIot = require("aws-iot-device-sdk");
var ioteventsdata = new AWS.IoTEventsData({apiVersion: '2018-10-23'});
var device = awsIot.device({
  keyPath: "./myPc.private.key",
  certPath: "./myPc.cert.pem",
  caPath: "./AmazonRootCA2.pem.crt",
  clientId: "myPc",
  host: "a2fgox9ykqo9ii-ats.iot.us-east-1.amazonaws.com",
});
var id = Math.floor(Math.random() * 50);
//var temp = Math.floor(Math.random() * 25) + 30;
//var humid = Math.floor(Math.random() * 25) + 35;

const data = {
  motorid: id,
  sensorData: {
    humidity:58,
    temperature:46
  }
};

var mssgid = Math.floor(Math.random() * 50);
var params = {
    messages: [ /* required */
      {
        inputName: 'TemperatureInput', 
        messageId: mssgid.toString(), 
        payload: JSON.stringify(data)   /* Strings will be Base-64 encoded on your behalf */, /* required */
    
      },
      /* more items */
    ]
  };
  ioteventsdata.batchPutMessage(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });

//   device.on("message", function (topic, payload) {
//     console.log("message", topic, payload.toString());
//   });