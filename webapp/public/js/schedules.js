function displaySchedules(schedules) {
    document.getElementById("schedules").innerHTML = schedules;
}
function loadSchedules() {
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