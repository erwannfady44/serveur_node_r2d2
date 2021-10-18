const mongoose = require('mongoose');

const stackSchema = mongoose.Schema({
    idUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
    rank: {type: Number, require: true}
});

module.exports = mongoose.model('Path', stackSchema);
