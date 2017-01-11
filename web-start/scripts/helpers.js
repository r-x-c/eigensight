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

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    return hrs + ' hours ' + mins + ' mins';
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}


Array.prototype.resize = function (newSize, defaultValue) {
    while (newSize > this.length)
        this.push(defaultValue);
    this.length = newSize;
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
    console.log("Inserting " + arr.length + " elements into table view");
    console.log(arr);
    var table = document.getElementById("timeTable");
    var sum = arr.reduce(function (a, b) {
        return a + b;
    }, 0);

    $('#timeTable').find('tr').not('tr:first').remove();

    for (var i = 0; i < arr.length; i++) {
        var row = table.insertRow(i + 1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = activity_labels[i];
        cell2.innerHTML = String(arr[i]).toHHMMSS();
        cell3.innerHTML = ((arr[i] / sum) * 100).toFixed(2) + '%';
        cell4.innerHTML = ((arr[i] / SECONDS_IN_DAY) * 100).toFixed(2) + '%';
    }
}

google.charts.load('current', {'packages': ['corechart']});
// google.charts.setOnLoadCallback(drawChart);

function drawChart(dataArr) {
    console.log("drawing to pie chart");
    if (dataArr.length !== activity_labels.length) {
        alert("data array length is not the same as activity label arrray length");
    }

    var formatted_data = [];
    formatted_data.push(['Task', 'Seconds']);
    for (var i = 0; i < dataArr.length; i++) {
        formatted_data.push([activity_labels[i], dataArr[i]]);
    }
    var data = google.visualization.arrayToDataTable(formatted_data);
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

function extract_ul_to_array() {
    var ul = document.getElementById("adjust_activities");
    $("ul.adjust_activities").children();
    for (var i = 0; i < ul.length; i++) {
        console.log(ul[i]);
    }
}



