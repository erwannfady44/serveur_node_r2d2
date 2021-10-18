//const usbSerial = '/dev/ttyUSB0';
const usbSerial = 'COM4';
const SerialPort = require('serialport');

const User = require('../Models/User');
const Stack = require('../Models/Stack')

let mega = null;

exports.connected = (ws) => {
    mega.on('open', () => {
        console.log("connection open")
    });

    ws.on('connection', () => {
        console.log('connected');
        console.log(url);
    })

    ws.on('message', (msg) => {

        function firstMessage() {

        }
        console.log(msg)
        let data = JSON.parse(msg)
        let payload = "01" + data.direction1.toString(16).toUpperCase() +
            "02" +
            data.direction2.toString(16).toUpperCase() +
            "11" +
            (data.speed1 < 16 ? '0' + data.speed1.toString(16).toUpperCase() : data.speed1.toString(16).toUpperCase()) +
            "12" +
            (data.speed2 < 16 ? '0' + data.speed2.toString(16).toUpperCase() : data.speed2.toString(16).toUpperCase())


        mega.write(payload, (err) => {
            if (err) {
                console.log(err)
            }
        })
    });

    ws.on("close", () => {
        console.log('close !!!');
        mega.write("01002011001200");
        mega.close();
    })

    mega.on('error', (err) => {
        console.log("error : " + err.message);
    })

    mega.on('data', function(data) {
        console.log('data received: ' + data);
    });
}

