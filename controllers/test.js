//var SerialPort = require('serialport');
//var mega = new SerialPort('COM4', {baudRate: 9600 });
//var mega = new SerialPort('/dev/ttyUSB0', {baudRate: 9600 });
const p = "01202211FF12FF";


function decode(payload) {
    let i = 0;
    let commande = new Array(4);
    while (i < payload.length - 1) {
        let code = strToHex(payload.substring(i, i + 2));
        i += 2;
        switch (code) {
            case 0x01:
                commande[0] = strToHex(payload.substring(i, i + 1));
                i += 1;
                break;

            case 0x02:
                commande[1] = strToHex(payload.substring(i, i + 1));
                i += 1;
                break;

            case 0x11:
                commande[2] = strToHex(payload.substring(i, i + 2));
                i += 2;
                break;

            case 0x12:
                commande[3] = strToHex(payload.substring(i, i + 2));
                i += 2;
                break;
        }
    }
    return commande;
}

function strToHex(str) {
    let result = 0;
    let j = 0;
    let powResult = 1;
    for (let i = str.length - 1; i >= 0; i--) {
        if (str.charCodeAt(i) >= 65) {
            let a = (str.charCodeAt(i) - "A".charCodeAt(0) + 10);
            let b = powResult * 16;
            let calcul = (str.charCodeAt(i) - "A".charCodeAt(0) + 10) * powResult;
            result += (str.charCodeAt(i) - "A".charCodeAt(0) + 10) * powResult;
        } else {
            let calcul = (str.charCodeAt(i) - "A".charCodeAt(0) + 10) * powResult;
            result += (str.charCodeAt(i) - "0".charCodeAt(0)) * powResult;
        }
        powResult *= 16;
    }
    return result;
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const i2c = require('i2c-bus');
const I2C_ADDRESS = 0x04;

const data = [0x01, 0x00, 0x02, 0x00, 0x11, 0xff, 0x12, 0xff];
const buf = Buffer.from(data);

i2c.openPromisified(1).
then(i2c1 => i2c1.i2cWrite(4, buf.length, buf).
    then(() => i2c1.close()).
    then(() => console.log("ok"))
).catch(console.log);