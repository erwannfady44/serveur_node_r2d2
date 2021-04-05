const usbSerial = 'COM4';
const SerialPort = require('serialport');

const mega = new SerialPort(usbSerial, {
    baudRate: 9600
});

exports.connected = (ws) => {
    ws.on('message', (msg) => {
        let buf = new Buffer.allocUnsafe(1);
        buf.write(msg);

        mega.write(buf, function (err) {
            if (err) {
                res.status(500).json(err);
                console.log('Error on write: ', err.message)
            } else {
                console.log('message written');
                res.status(200).json();
            }
        });
    })
}
