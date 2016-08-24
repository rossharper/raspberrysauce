'use strict';

const User = require('./../models/user');
const pass = require('pwd');

function addUser(username, salt, password, email) {
    const newUser = new User();

    newUser.username = username;
    newUser.salt = salt;
    newUser.password = password;
    newUser.email = email;

    // TODO: save user
}

function createUser(username, password, email) {
    pass.hash(password, (err, salt, passhash) => {
        if (err) {
            console.log(err);
        } else {
            addUser(username, salt, passhash, email);
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
