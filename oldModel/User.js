const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    name: {type: String, require: true, unique: false},
    password: {type: String, require: false},
    isAdmin: {type: Boolean, require: true}
});

//userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);
