var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    username: String,
    salt: String,
    password: String,
    email: String
});