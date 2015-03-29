var chalk = require('chalk');

var led;

try {
    led = require('./gpioled');
}
catch(err) {
    console.error(chalk.red(chalk.bold("ERROR") + ": gpio not available, using stubbed LED"));
    led = require('./stubled');
}

module.exports = led;