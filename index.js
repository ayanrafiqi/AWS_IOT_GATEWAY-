/*This code can be used to simulate IoT devices publishing data to the AWS IoT Core.
User can edit the number_of_devices and the number of messages_per_device to be published.
The function publishes the data every 1 second by default.


*/

// You can change the sdk to the newer aws-iot-device-sdk-v2 version.
let awsIot = require("aws-iot-device-sdk");


const path = "E:\AWS IOT\myPc" + ".";  
const hostName = "a2fgox9ykqo9ii-ats.iot.us-east-1.amazonaws.com";
const iot_topic = "myPc";


let device = {
  keyPath: path + "private.key",
  certPath: path + "cert.pem",
  caPath: path + "AmazonRootCA1.cer",
  host: hostName,
};

let devices = [];
let count = [];
let timeout = [];
let cleared = 0;

// variables to be edited
const inter = 1000;
const number_of_devices = 2;
const messages_per_device = 10;

console.log(
  "\n..........................................\n\nSimulating",
  number_of_devices,
  "IoT devices for Temperature,\npublishing a total of",
  messages_per_device,
  "messages after every",
  inter,
  "milliseconds \nto topic:",
  iot_topic,
  "\n"
);

for (let i = 0; i < number_of_devices; i++) {
  let tempDevice = device;
  tempDevice.clientId = "device_id_" + (i + 1).toString();
  devices[i] = awsIot.device(tempDevice);

  count.push(0);
  timeout.push(null);
}

devices.forEach((device, i) => {
  device.on("connect", function () {
    console.log("Device", i + 1, "connected");
    device.subscribe(iot_topic);
    timeout[i] = setInterval(() => publishData(device, i), inter);
  });
});

function publishData(device, i) {
  count[i]++;

  // clear interval if messages_per_device is reached
  if (count[i] > messages_per_device) {
    clearInterval(timeout[i]);
    cleared++;
    checkFinished();
    return;
  }

  // publish data to the topic iot_topic
  
  device.publish(
    iot_topic,
    JSON.stringify({
      device_id: `device_id_${i + 1}`,
      time_stamp: new Date().toISOString(),
      sensor: "Temperature",
      value: 20 + Math.random() * 5,
    })
  );

  console.log(
    "device_id_",
    i + 1,
    i + 1 > 99 ? "" : i + 1 > 9 ? " " : "  ",
    ": Item",
    count[i],
    count[i] > 99 ? "" : count[i] > 9 ? " " : "  ",
    "published at",
    new Date()
  );
}

function checkFinished() {
  // if all intervals are cleared i.e. all devices have published messages_per_device messages, then exit
  if (cleared == number_of_devices) {
    console.log("\nAll messages published\n");
    process.exit();
  }
}