var passport = require('passport');

var auth = {
    getAuthenticationHandler: function() {
        return passport.authenticate(
            'local', 
            { 
                successRedirect: '/',
                failureRedirect: '/login' 
            });
    }    
}

module.exports = auth;