const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const stackSchema = mongoose.Schema({
    idUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true, unique: true},
    rank: {type: Number, require: true}
});

stackSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Stack', stackSchema);
