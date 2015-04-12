function displaySchedules(schedules) {
    document.getElementById("loadSpinner").classList.add('hidden');
    document.getElementById("schedules").innerHTML = schedules;
}
function loadSchedules() {
    document.getElementById("loadSpinner").classList.remove('hidden');
    document.getElementById("schedules").innerHTML = "";

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var jsonResponse = JSON.parse(xhr.responseText);
                displaySchedules(jsonResponse);
            }
        }
    }
    xhr.open('GET', 'api/schedule/all', true);
    xhr.send(null);
}
function onAddSchedule() {
    $('#addButton').prop('disabled', true);
    $('#addschedule').collapse('show');
}
function onCancelAddSchedule() {
    $('#addschedule').collapse('hide');
    $('#addButton').prop('disabled', false);
}
function onSaveSchedule() {
    if(document.getElementById('temp').value.length > 0) {
        $('#addschedule').collapse('hide');

        var params = "startTime=" + document.getElementById('startTime').value
            + "&endTime=" + document.getElementById('endTime').value
            + "&temperature=" + document.getElementById('temp').value;

        var http = new XMLHttpRequest();

        http.open("POST", "/api/schedule/add", true);

        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        http.onreadystatechange = function () {
            if (http.readyState == 4) {
                if (http.status == 200) {
                    loadSchedules();
                }
                else {
                }
                $('#addButton').prop('disabled', false);
            }
        };

        http.send(params);
    }
}
window.onload = function() {
    loadSchedules();
}
