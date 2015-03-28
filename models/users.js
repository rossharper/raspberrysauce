/* temporary shitty user model */

var users = [
    { id: 1, username: 'ross', password: 'secretshash' }
];

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

module.exports = {
    findById: findById,
    findByUsername: findByUsername
};
