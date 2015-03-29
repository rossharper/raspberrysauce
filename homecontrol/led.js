function turnLedOn() {
    console.log("Turn LED ON");
}

function turnLedOff() {
    console.log("Turn LED OFF");
}

function isOn() {
    return false;
}

module.exports = {
    turnLedOn: turnLedOn,
    turnLedOff: turnLedOff,
    isOn: isOn
}