'use strict';

const Realm = require('realm');
const uuid = require('uuid');

const TokenSchema = {
  name: 'Token',
  primaryKey: 'token',
  properties: {
    username:  'string',
    token: 'string',
    expiry: {type: 'date'},
  }
};

const realm = new Realm({schema: [TokenSchema]});

module.exports = {

  createToken: function (username) {

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 28);

    const token = {
      username: username,
      token: uuid.v4(),
      expiry: expiry
    };

    realm.write(() => {
      realm.create('Token', {username: token.username, token: token.token, expiry: token.expiry});
    });

    return token;
  },

  findToken: function(tokenValue, done) {
    const tokens = realm.objects('Token');
    const tokenQuery = `token = "${tokenValue}"`;
    const theTokens = tokens.filtered(tokenQuery);
    if(theTokens.length > 0) {
      const theToken = theTokens[0];
      done(null, {
        username: theToken.username,
        token: theToken.token,
        expiry: theToken.expiry
      });
    }
    else {
      done(null, false);
    }
  },

  deleteToken: function(tokenValue, done) {
    const tokens = realm.objects('Token');
    const theTokens = tokens.filtered('token = `${tokenValue}`');

    if(theTokens.length > 0) {
      const theToken = theTokens[0];
      realm.write(() => {
        realm.delete(theToken);
      });
    }
    done();
  }

};
