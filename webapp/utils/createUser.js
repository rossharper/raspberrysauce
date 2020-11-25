'use strict';

const UserCreator = require('../auth/UserCreator');
const UserRepository = require('../auth/userRepository');
const DEFAULTS = require('../../defaults');

function parseArgs() {
  const args = {
    webappDataPath: DEFAULTS.webappDataPath
  };
  if (process.argv.indexOf('-u') !== -1) {
    args.username = process.argv[process.argv.indexOf('-u') + 1];
  }

  if (process.argv.indexOf('-p') !== -1) {
    args.password = process.argv[process.argv.indexOf('-p') + 1];
  }

  if (process.argv.indexOf('-e') !== -1) {
    args.email = process.argv[process.argv.indexOf('-e') + 1];
  }

  if (process.argv.indexOf('-webappDataPath') !== -1) {
    args.webappDataPath = process.argv[process.argv.indexOf('-webappDataPath') + 1]
  }

  return args;
}

function main() {
  const args = parseArgs();

  if (!args.username || !args.password || !args.email) {
    console.log('Usage: node createUser.js -u <username> -p <password> -e <email>');
  } else {
    new UserCreator(new UserRepository(args.webappDataPath)).createUser(args.username, args.password, args.email, (err) => {
      if (err) throw err;
    });
  }
}
main();
