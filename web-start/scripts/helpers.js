/**
 * Created by richard on 12/25/16.
 */

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
};


function get_time_key(offset) {
    var n = new Date();
    n.setDate(n.getDate() + offset);
    var m = n.getMonth() + 1;
    var d = n.getDate();
    if (m < 10) {
        m = "0" + m;
    }
    if (d < 10) {
        d = "0" + d;
    }
    return m + "" + d + "" + n.getFullYear();
}

function get_s_key() {
    var n = new Date();
    return (n.getMilliseconds() * .001) + n.getSeconds() + (n.getMinutes() * 60) + (n.getHours()) * 3600;

}


function displayArray(arr) {
    //todo: this inefficiently updates all el of table
    var table = document.getElementById("timeTable");
    // var activities = document.getElementById("activitySelector");
    // console.log(activities);
    var sum = arr.reduce(function (a, b) {
        return a + b;
    }, 0);
    console.log("Inserting " + arr.length + " elements...");
    var tableRows = table.getElementsByTagName('tr');
    console.log(tableRows);

    for (var i = 0; i < arr.length; i++) {
        table.deleteRow(i + 1);
        var row = table.insertRow(i + 1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = activityLabels[i];
        cell2.innerHTML = String(arr[i]).toHHMMSS();
        cell3.innerHTML = ((arr[i] / sum) * 100).toFixed(2) + '%';
        cell4.innerHTML = ((arr[i] / SECONDS_IN_DAY) * 100).toFixed(2) + '%';
    }
}

function drawChart(dataArr) {
    google.charts.load('current', {'packages': ['corechart']});
    //todo: support dynamically set activities
    // var labels = document.getElementById("activitySelector");
    // var data = google.visualization.arrayToDataTable(dataArr);
    var data = google.visualization.arrayToDataTable([
        ['Task', 'Seconds per Day'],
        [activityLabels[0], dataArr[0]],
        [activityLabels[1], dataArr[1]],
        [activityLabels[2], dataArr[2]],
        [activityLabels[3], dataArr[3]],
        [activityLabels[4], dataArr[4]],
        [activityLabels[5], dataArr[5]],
        [activityLabels[6], dataArr[6]],
        [activityLabels[7], dataArr[7]]
    ]);

    var options = {
        title: 'Activity Breakdown'
    };
    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(data, options);
}


function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}


function append_li_to_ul(activity_array) {
    var ul = document.getElementById("adjust_activities");
    $('#adjust_activities').find('li').not('li:first').remove();
    for (i = 0; i < activity_array.length - 1; i++) {
        var li = document.createElement("li");
        var label = document.createElement("label");
        var button = document.createElement("button")
        button.innerHTML = "delete";
        label.innerHTML = activity_array[i];
        li.appendChild(label);
        li.appendChild(button);
        ul.appendChild(li);
    }
}

function extract_ul_to_array() {
    var ul = document.getElementById("adjust_activities");
    $("ul.adjust_activities").children();
    for (var i = 0; i < ul.length; i++) {
        console.log(ul[i]);
    }
}



