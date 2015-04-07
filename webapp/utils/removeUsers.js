var User = require('./../models/user'),
    mongoose = require('mongoose');

var dbConfig = require('./../db/db.js');

mongoose.connect(dbConfig.url);

User.find({}).remove(function(err) {
    console.log('users removed');
});
