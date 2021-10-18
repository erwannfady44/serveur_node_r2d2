const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../Models/User');

const keyToken = 'P7H}9C7ccv^Sk7Yia0C1Te1o3g2gqTt6EmuyIi.g8(}iQLM+sGX5577&0SF)e50)kjDomBt6Ns^MAHZ7#3Tq{87~2m=UInz7L05@XwC2dJHS5FAX:P?3@*:2ALII4G@Hf!Uc1akX?:xMm6bt<(b27VW80lcVf&;d99CVfNS+0Ni28Q{q8!7Y5}(C48zO@x5C8-PHn/j=Bc00998C{VK:cE09GS5_B10R8YR3?077r~v89hQI6p{Kydu65|0$py&c{Pdl[70FL|B%);uib4*dQ5@6!^%6^$j1vhn2%5H=E02!6224[nFiF5,&ctI-~s(7@L&:,~0e281ki>1A7FS7:7$2KTfe3u787a^8-qH4Yu6R96a@)p*25811~|RG,9UpsA$;1hW7[(/OZb5)6rN~:swMTam7/h!{^PjWE0<2WK$+$i?}p:%e;3g~A%:q)zZs$lL9$A>Z>qF}[4wUYf#0&*Mq8csI$?5F2mG@o^ZhsMa]wRDSqY#m0[j@lt/$zoW7';

exports.signUp = (req, res) => {
    User.findOne({pseudo: req.body.pseudo})
        .then((user) => {
            if (user)
                res.status(409).json({error: "pseudo already user"})
            else {
                bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        const user = new User({
                            pseudo: req.body.pseudo,
                            password: hash
                        });
                        user.save()
                            .then(() => {
                                res.status(201).json({
                                    idUser: user._id,
                                    token: jwt.sign(
                                        {idUser: user._id, pseudo: user.pseudo},
                                        keyToken,
                                        {expiresIn: '24h'}
                                    )
                                })
                            }).catch(err => res.status(500).json(err))
                    })
            }
        })
}

exports.signIp = (req, res) => {
    User.findOne({pseudo: req.body.pseudo})
        .then(user => {
            if (!user)
                res.status(404).json({err: "User not found"})
            else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({err: "Wrong password"})
                        } else {
                            res.status(200).json({
                                idUser: user._id,
                                token: jwt.sign({
                                    idUser: user._id,
                                }, keyToken)
                            })
                        }
                    })
            }
        })
}
