var passport = require('passport');

var auth = {
    getAuthenticationHandler: function(authenticationRedirects) {
        return passport.authenticate(
            'local', authenticationRedirects);
    }    
}

module.exports = auth;