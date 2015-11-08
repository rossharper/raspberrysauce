function displayTemperature(temperature) {
    var displayTemperature = roundToOneDecimalPlace(temperature);
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

function displayBattery(batteryVoltage) {
    document.getElementById("currentBattery").innerHTML = roundToOneDecimalPlace(batteryVoltage) + "V";
}

function displayElement(elementId, display) {
    if(display) {
        $("#" + elementId).removeClass('hidden');
        document.getElementById("modetile").title = elementId;
    }
    else {
        $("#" + elementId).addClass('hidden');
    }
}

function displayProgrammeMode(programme) {

    $('#autoModeButton').button('toggle');

    displayElement("currentModeSpin", false);
    displayElement("comfortMode", programme.heatingEnabled && programme.comfortLevelEnabled);
    displayElement("setbackMode", programme.heatingEnabled && !programme.comfortLevelEnabled);
    displayElement("offMode", !programme.heatingEnabled);
}

function displayView(viewData) {
    displayProgrammeMode(viewData.programme)
    displayTemperature(viewData.temperature);
    displayBattery(viewData.batteryVoltage);
}

function scheduleReload() {
    window.setTimeout(loadView, 60000);
}
function loadView() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if(xhr.status === 200) {
                var jsonResponse = JSON.parse(xhr.responseText);
                displayView(jsonResponse);
            }
            scheduleReload();
        }
    }
    xhr.open('GET', 'api/views/home', true);
    xhr.send(null);
}
