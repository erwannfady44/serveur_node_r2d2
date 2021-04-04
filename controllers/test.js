const usbSerial = 'COM4';
const SerialPort = require('serialport');

const mega = new SerialPort(usbSerial, {
    baudRate: 9600
});

exports.test = async (req, res) => {
    let buf = new Buffer.allocUnsafe(1);
    buf.write(req.query.a);

    mega.write(buf, function (err) {
        if (err) {
            res.status(500).json(err);
            console.log('Error on write: ', err.message)
        } else {
            console.log('message written');
            res.status(200).json();
        }
    });
}
