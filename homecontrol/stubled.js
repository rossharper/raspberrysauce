var chalk = require('chalk');

module.exports = {
    turnLedOn: function() {
        console.log("Turn LED " + chalk.green("ON") + chalk.bold(" (STUB)"));
    }
    ,
    turnLedOff: function() {
        console.log("Turn LED " + chalk.red("OFF") + chalk.bold(" (STUB)"));
    }
    ,
    isOn: function() {
        return false;
    }
}