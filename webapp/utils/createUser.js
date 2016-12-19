'use strict';

const createUser = require('../auth/createUser').createUser;

function parseArgs() {
  const args = {};
  if (process.argv.indexOf('-u') !== -1) {
    args.username = process.argv[process.argv.indexOf('-u') + 1];
  }

  if (process.argv.indexOf('-p') !== -1) {
    args.password = process.argv[process.argv.indexOf('-p') + 1];
  }

  if (process.argv.indexOf('-e') !== -1) {
    args.email = process.argv[process.argv.indexOf('-e') + 1];
  }

  return args;
}

function main() {
  const args = parseArgs();

  if (!args.username || !args.password || !args.email) {
    console.log('Usage: node createUser.js -u <username> -p <password> -e <email>');
  } else {
    createUser(args.username, args.password, args.email, (err) => {
      if (err) throw err;
    });
  }
}
main();
