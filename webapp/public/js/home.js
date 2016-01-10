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

function displayTodaysProgramme(programme) {
    var comfortPeriodsPanel = document.getElementById("comfortPeriods");
    var innerHtml = "";
    programme.todaysPeriods.forEach(function(comfortPeriod) {
        if(comfortPeriod.isComfort) {
            innerHtml += "<span class='fa fa-sun-o'></span>&nbsp;";
        }
        innerHtml += comfortPeriod.startTime + " &ndash; " + comfortPeriod.endTime + "<br />";
    });
    comfortPeriodsPanel.innerHTML = innerHtml;
}

function displayBattery(batteryVoltage) {
    $("#batteryLevelEmpty").addClass('hidden');
    $("#batteryLevelQuarter").addClass('hidden');
    $("#batteryLevelHalf").addClass('hidden');
    $("#batteryLevelThreeQuarters").addClass('hidden');
    $("#batteryLevelFull").addClass('hidden');
    if(batteryVoltage < 2.00) {
        $("#batteryLevelEmpty").removeClass('hidden');
        document.getElementById("batterytile").title = "Empty";
    } else if (batteryVoltage < 2.33) {
        $("#batteryLevelQuarter").removeClass('hidden');
        document.getElementById("batterytile").title = "Quarter";
    } else if (batteryVoltage < 2.66) {
        $("#batteryLevelHalf").removeClass('hidden');
        document.getElementById("batterytile").title = "Half";
    } else if (batteryVoltage < 2.99) {
        $("#batteryLevelThreeQuarters").removeClass('hidden');
        document.getElementById("batterytile").title = "ThreeQuarter";
    } else { // batteryVoltage >= 3
        $("#batteryLevelFull").removeClass('hidden');
        document.getElementById("batterytile").title = "Full";
    }

    var displayVoltage = roundToOneDecimalPlace(batteryVoltage)
    document.getElementById("currentBattery").innerHTML = displayVoltage + "V";
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
    displayElement("currentModeSpin", false);
    displayElement("comfortMode", programme.heatingEnabled && programme.comfortLevelEnabled);
    displayElement("setbackMode", programme.heatingEnabled && !programme.comfortLevelEnabled);
    displayElement("offMode", !programme.heatingEnabled);
}

function toggleModeSelector(programme) {
    if(programme.heatingEnabled) {
        if(programme.inOverride) {
            if(programme.comfortLevelEnabled) {
                $("#comfortModeButton").button('toggle');
            }
            else {
                $("#setbackModeButton").button('toggle');
            }
        }
        else {
            $("#autoModeButton").button('toggle');
        }
    }
    else {
        $("#offModeButton").button('toggle');
    }
}

function displayView(viewData) {
    toggleModeSelector(viewData.programme);
    displayProgrammeMode(viewData.programme);
    displayTemperature(viewData.temperature);
    displayTodaysProgramme(viewData.programme);
    displayBattery(viewData.batteryVoltage);
}
function setModeViaApi(apiPath) {
    clearTimeout(reloadTimeout);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if(xhr.status === 200) {
                // do nothing with response for now
            }
            loadView();
        }
    }
    xhr.open('GET', apiPath, true);
    xhr.send(null);
}
function onAutoModeButtonPressed() {
    setModeViaApi('api/programme/setMode/auto');
}
function onComfortModeButtonPressed() {
    setModeViaApi('api/programme/setMode/comfort');
}
function onSetbackModeButtonPressed() {
    setModeViaApi('api/programme/setMode/setback');
}
function onOffModeButtonPressed() {
    setModeViaApi('api/programme/setMode/heatingOff');
}
function bindButtons() {
    $('#autoModeButton').on('click', onAutoModeButtonPressed);
    $('#comfortModeButton').on('click', onComfortModeButtonPressed);
    $('#setbackModeButton').on('click', onSetbackModeButtonPressed);
    $('#offModeButton').on('click', onOffModeButtonPressed);
}

var reloadTimeout;

function scheduleReload() {
    reloadTimeout = window.setTimeout(loadView, 60000);
}
function initHomeView() {
    loadView();
    bindButtons();
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
    xhr.setRequestHeader("If-Modified-Since", "Mon, 27 Mar 1972 00:00:00 GMT");
    xhr.send(null);
}
