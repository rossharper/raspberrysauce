/* temporary shitty user model */

var users = require('../config/userlist');

function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
        fn(null, users[idx]);
    } 
    else {
        fn(new Error('User ' + id + ' does not exist'));
    }
}

function findByUsername(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}

function serializeUser(user, done) {
    done(null, user.id);
}

function deserializeUser(id, done) {
    findById(id, done);
}

module.exports = {
    findById: findById,
    findByUsername: findByUsername,
    serializeUser: serializeUser,
    deserializeUser: deserializeUser
};
