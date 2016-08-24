'use strict';

const User = require('../auth/user');
const userRepository = require('../auth/userRepository');
const pass = require('pwd');

function createUser(username, password, email) {
    pass.hash(password, (err, salt, passhash) => {
        if (err) {
            console.log(err);
        } else {
            userRepository.addUser(new User(username, salt, passhash, email), (err) => {
              if (err) throw err;
            });
        }
    });
}

let username;
if (process.argv.indexOf('-u') !== -1) {
    username = process.argv[process.argv.indexOf('-u') + 1];
}

let password;
if (process.argv.indexOf('-p') !== -1) {
    password = process.argv[process.argv.indexOf('-p') + 1];
}

let email;
if (process.argv.indexOf('-e') !== -1) {
    email = process.argv[process.argv.indexOf('-e') + 1];
}

if (!username || !password || !email) {
    console.log('Usage: node createUser.js -u <username> -p <password> -e <email>');
} else {
    createUser(username, password, email);
}
