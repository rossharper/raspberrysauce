function generateBatteryChart(voltages) {
    generateChart(voltages, '#chart', 'batteryVoltage', {max: 3.3, min: 0});
}
function scheduleBattChartReload() {
    window.setTimeout(loadBattChart, 300000);
}
function loadBattChart() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var jsonResponse = JSON.parse(xhr.responseText);
                generateBatteryChart(jsonResponse);
            }
            scheduleBattChartReload();
        }
    }
    xhr.open('GET', 'api/battery/history', true);
    xhr.send(null);
}
