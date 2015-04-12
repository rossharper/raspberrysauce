function generateChart(data, chart, value) {
    var chart = c3.generate({
        bindto: chart,
        data: {
            json: data,
            keys: {
                x: 'date',
                value: [value]
            }
        },
        axis: {
            x: {
                type: 'category'
            }
        }
    });
}
function generateTemperatureChart(temperatures) {
    generateChart(temperatures, '#tempchart', 'temperature');
}
function generateBatteryChart(voltages) {
    generateChart(voltages, '#battchart', 'batteryVoltage');
}
function scheduleBattChartReload() {
    window.setTimeout(loadBatteryChart, 300000);
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
function scheduleTempChartReload() {
    window.setTimeout(loadTempChart, 60000);
}
function loadTempChart() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var jsonResponse = JSON.parse(xhr.responseText);
                generateTemperatureChart(jsonResponse);
            }
            scheduleTempChartReload();
        }
    }
    xhr.open('GET', 'api/temperature/history', true);
    xhr.send(null);
}