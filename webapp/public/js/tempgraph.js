function generateTemperatureChart(temperatures) {
    generateChart(temperatures, '#chart', 'temperature');
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