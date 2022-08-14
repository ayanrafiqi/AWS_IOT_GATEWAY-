var awsIot = require("aws-iot-device-sdk");

var device = awsIot.device({
  keyPath: "./myPc.private.key",
  certPath: "./myPc.cert.pem",
  caPath: "./AmazonRootCA2.pem.crt",
  clientId: "myPc",
  host: "a2fgox9ykqo9ii-ats.iot.us-east-1.amazonaws.com",
});
var id = Math.floor(Math.random() * 50);
var temp = Math.floor(Math.random() * 25) + 30;
var humid = Math.floor(Math.random() * 25) + 35;

const data = {
  motorid: id,
  sensorData: {
    humidity:humid,
    temperature:temp
  }
};

device.on("connect", function () {
  console.log("Connect To AWS");
  //device.subscribe("topic_1");
  device.publish("tempTopic", JSON.stringify(data));
  console.log("message sent");
});

device.on("message", function (topic, payload) {
  console.log("message", topic, payload.toString());
});
