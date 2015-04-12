function roundToOneDecimalPlace(number) {
    return Math.round(number * 10) / 10;
}

function displayTemperature(temperature) {
    var displayTemperature = roundToOneDecimalPlace(temperature.temperature);
    document.getElementById("currentTemperature").innerHTML = displayTemperature + "&deg;C";
    var ranges = [0,1,4,7,10,13,16,19,22,25];
    var i = 0;
    while(i < ranges.length) {
        if(displayTemperature < ranges[i]) break;
        ++i;
    }
    var tempClass = ranges[Math.max(i-1, 0)];
    document.getElementById("temperaturetile").title = tempClass;
}
function scheduleTemperatureReload() {
    window.setTimeout(loadTemperature, 60000);
}
function loadTemperature() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if(xhr.status === 200) {
                var jsonResponse = JSON.parse(xhr.responseText);
                displayTemperature(jsonResponse);
            }
            scheduleTemperatureReload();
        }
    }
    xhr.open('GET', 'api/temperature/currentTemperature', true);
    xhr.send(null);
}
function displayBattery(battery) {
    document.getElementById("currentBattery").innerHTML = roundToOneDecimalPlace(battery.batteryVoltage) + "V";
}
function scheduleBatteryReload() {
    window.setTimeout(loadBattery, 300000);
}
function loadBattery() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var jsonResponse = JSON.parse(xhr.responseText);
                displayBattery(jsonResponse);
            }
            scheduleBatteryReload();
        }
    }
    xhr.open('GET', 'api/battery/currentVoltage', true);
    xhr.send(null);
}