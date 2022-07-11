const jwt = require('jsonwebtoken');

const User = require('../models').User;
const Stack = require('../models').Stack;

const i2c = require('i2c-bus');
const I2C_ADDRESS = 0x09;

const keyToken = 'P7H}9C7ccv^Sk7Yia0C1Te1o3g2gqTt6EmuyIi.g8(}iQLM+sGX5577&0SF)e50)kjDomBt6Ns^MAHZ7#3Tq{87~2m=UInz7L05@XwC2dJHS5FAX:P?3@*:2ALII4G@Hf!Uc1akX?:xMm6bt<(b27VW80lcVf&;d99CVfNS+0Ni28Q{q8!7Y5}(C48zO@x5C8-PHn/j=Bc00998C{VK:cE09GS5_B10R8YR3?077r~v89hQI6p{Kydu65|0$py&c{Pdl[70FL|B%);uib4*dQ5@6!^%6^$j1vhn2%5H=E02!6224[nFiF5,&ctI-~s(7@L&:,~0e281ki>1A7FS7:7$2KTfe3u787a^8-qH4Yu6R96a@)p*25811~|RG,9UpsA$;1hW7[(/OZb5)6rN~:swMTam7/h!{^PjWE0<2WK$+$i?}p:%e;3g~A%:q)zZs$lL9$A>Z>qF}[4wUYf#0&*Mq8csI$?5F2mG@o^ZhsMa]wRDSqY#m0[j@lt/$zoW7';
let token = "";


let rankController = -1;

exports.connected = (ws) => {
    ws.on('connection', async () => {
        console.log("connected")
    })
    ws.on('message', async (msg) => {
        let data = JSON.parse(msg);
        //connection init
        if (data.token === "") {
            try {
                await initConnection()
            } catch (err) {
                console.log(err.message)
                ws.send(JSON.stringify(err));
            }
        } else {
            token = data.token
            const decodedToken = jwt.verify(data.token, keyToken);
            const rank = decodedToken.rank;
            if (rank === rankController) {
                //payload creation
                let payload = Buffer.from([0x01, data.direction1, 0x02, data.direction2, 0x11, data.speed1, 0x12, data.speed2,0x03, data.head]);
                console.log(payload)
                i2c.openPromisified(1).
                then(i2c1 => i2c1.i2cWrite(I2C_ADDRESS, payload.length, payload).
                    then(() => i2c1.close())
                ).catch(console.log);
            } else {
                //update rankController
                rankController = await getRankController();
                ws.send(JSON.stringify({
                    err: "not your turn",
                    rank: rank - rankController
                }));
            }
        }

        function initConnection() {
            return new Promise(async (resolve, reject) => {
                let name = Math.floor(Math.random() * 999999);
                while (await nameAlreadyUse(name)) {
                    name = Math.floor(Math.random() * 999999);
                }

                let user = new User({
                    name: name,
                    isAdmin: false
                });
                user.save()
                    .then(() => {
                        Stack.max('rank')
                            .then(max => {
                                let userRank = max === null ? 0 : max + 1;

                                let stack = new Stack({
                                    idUser: user.id,
                                    rank: userRank % 5000
                                });
                                stack.save()
                                    .then(async () => {
                                        ws.send(JSON.stringify({
                                            token: jwt.sign({
                                                idUser: user.id,
                                                rank: userRank,
                                            }, keyToken)
                                        }));

                                        rankController = await getRankController();

                                        resolve(userRank)
                                    })
                                    .catch(err => reject(err))
                            })
                            .catch(err => reject(err))
                    })
            })
        }

        function getRankController() {
            return new Promise(resolve => {
                Stack.findOne({order: [['rank', 'ASC']]})
                    .then(stackElement => {
                        resolve(stackElement.rank);
                    }).catch(err => console.error(err))
            })
        }

        function nameAlreadyUse(name) {
            return new Promise((resolve, reject) => {
                User.findOne({where: {name: name}})
                    .then((user) => {
                        resolve(user !== null)
                    }).catch(err => reject(err))
            })
        }
    });
    /*ws.on('close', () => {
        console.log("close")

        const payload = Buffer.from([0x01, 0x00, 0x02, 0x00, 0x11, 0x00, 0x12, 0x00]);

        i2c.openPromisified(1).
        then(i2c1 => i2c1.i2cWrite(4, payload.length, payload).
            then(() => i2c1.close())
        ).catch(console.log);
        if (token) {
            const decodedToken = jwt.verify(token, keyToken);
            Stack.destroy({
                where: {idUser: decodedToken.idUser}
            })
                .then(() => {
                    User.destroy({
                        where: {
                            id: decodedToken.idUser
                        }
                    })
                        .then(() => console.log("close"))
                })
        }
    })*/
}

