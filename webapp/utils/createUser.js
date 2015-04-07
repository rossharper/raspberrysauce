var User = require('./../models/user'),
    mongoose = require('mongoose'),
    pass = require('pwd');

var dbConfig = require('./../db/db.js');

function addUser(username, salt, password, email) {
    mongoose.connect(dbConfig.url);

    var newUser = new User();

    newUser.username = username;
    newUser.salt = salt;
    newUser.password = password;
    newUser.email = email;

    newUser.save(function (err) {
        if (err) {
            console.log('Error in Saving user: ' + err);
            throw err;
        }
        console.log('User Registration succesful');
        return done(null, newUser);
    });
}

function createUser(username, password, email) {
    pass.hash(password, function(err, salt, passhash) {
        if(err) {
            console.log(err);
        }
        else
        {
            addUser(username, salt, passhash, email);
        }
    });
}

var argv = process.argv;

var username;
if(process.argv.indexOf("-u") != -1){
    username = process.argv[process.argv.indexOf("-u") + 1];
}

var password;
if(process.argv.indexOf("-p") != -1){
    password = process.argv[process.argv.indexOf("-p") + 1];
}

var email;
if(process.argv.indexOf("-e") != -1){
    email = process.argv[process.argv.indexOf("-e") + 1];
}

if(!username || !password || !email) {
    console.log("Usage: node createUser.js -u <username> -p <password> -e <email>");
} else {
    createUser(username, password, email);
}
