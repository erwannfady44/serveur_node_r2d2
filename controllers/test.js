//var SerialPort = require('serialport');
//var mega = new SerialPort('COM4', {baudRate: 9600 });
//var mega = new SerialPort('/dev/ttyUSB0', {baudRate: 9600 });
const p = "01202211FF12FF";
//main();
//strToHex("01")
int = 255
console.log(int.toString(16).toUpperCase())

function decode(payload) {
    let i = 0;
    while (i < payload.length - 1) {
        switch (payload.substr(i, i + 2)) {

        }
    }
}

function strToHex(str) {
    let result = 0;
    let j = 0;

    for (let i = str.length - 1; i >= 0; i--) {
        if (str.charCodeAt(i) >= 65) {
            let a = (str.charCodeAt(i) - "A".charCodeAt(0) + 10);
            let b = mathPow(16, j);
            let calcul = (str.charCodeAt(i) - "A".charCodeAt(0) + 10) * mathPow(16, j);
            result += (str.charCodeAt(i) - "A".charCodeAt(0) + 10) * mathPow(16, j++);
        } else {
            let calcul = (str.charCodeAt(i) - "A".charCodeAt(0) + 10) * mathPow(16, j);
            result += (str.charCodeAt(i) - "0".charCodeAt(0)) * mathPow(16, j++);
        }
    }
    console.log(result)
}

function mathPow(x, y) {
    if (y === 0) {
        return 1;
    }

    let result = 1;
    for (let i = 0; i < y; i++) {
        result *= x;
    }
    return result;
}

async function main() {
    mega.open();
    mega.on('open', () => {
        console.log("connection open")
    });

    mega.on('error', (err) => {
        console.log("error : " + err.message);
    })

    await sleep(1000);

    mega.write(Buffer.from([0x01]), (err) => {
        if (err) {
            console.log('error : ' + err);
        } else {
            console.log("success")
        }
    })
    await sleep(1000);


    mega.write(Buffer.from([0x01]), (err) => {
        if (err) {
            console.log('error : ' + err);
        } else {
            console.log("success 2")
        }
    })

    await sleep(1000);


    mega.write(Buffer.from([0x01]), (err) => {
        if (err) {
            console.log('error : ' + err);
        } else {
            console.log("success 3")
        }
    })

    await sleep(1000);

    mega.write(Buffer.from([0x01]), (err) => {
        if (err) {
            console.log('error : ' + err);
        } else {
            console.log("success 4")
        }
    })

//mega.close();
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}