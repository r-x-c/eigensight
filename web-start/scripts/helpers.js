/**
 * Created by richard on 12/25/16.
 */


function debug(text) {
    if (DEBUG) {
        console.log(text);
    }
}

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
    return hrs + 'h ' + mins + 'm';
}

function msToTime_plain(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    return pad(hrs) + ':' + pad(mins);
}


function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}


Array.prototype.resize = function (newSize, defaultValue) {
    while (newSize > this.length)
        this.push(defaultValue);
    this.length = newSize;
};


function get_date_key(offset) {
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


function get_time_key(n) {
    if (n === undefined) {
        n = new Date();
    }
    return (n.getMilliseconds() * .001) + n.getSeconds() + (n.getMinutes() * 60) + (n.getHours()) * 3600;

}


function displayArray(arr, goal_arr) {
    debug('Loading table view');
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
        cell2.innerHTML =  msToTime_plain(arr[i] * 1000);
        cell3.innerHTML = ((arr[i] / sum) * 100).toFixed(0) + '%';
        cell4.innerHTML = ((arr[i] / SECONDS_IN_DAY) * 100).toFixed(0) + '%';
    }
    for(var x = 0; x < DEFAULT_DISTRIBUTION_GOALS.length; x++){
        debug(DEFAULT_DISTRIBUTION_GOALS[x]);
    }
    var distr_sum = goal_arr.reduce(function(a, b) { return a + b; }, 0);

    debug(distr_sum);
}

// google.charts.setOnLoadCallback(drawChart);

function draw_google_chart(dataArr) {
    var data = Charts.newDataTable()
        .addColumn(Charts.ColumnType.STRING, "Month")
        .addColumn(Charts.ColumnType.NUMBER, "In Store")
        .addColumn(Charts.ColumnType.NUMBER, "Online")
        .addRow(["January", 10, 1])
        .addRow(["February", 12, 1])
        .addRow(["March", 20, 2])
        .addRow(["April", 25, 3])
        .addRow(["May", 30, 4])
        .build();

    var chart = Charts.newAreaChart()
        .setDataTable(data)
        .setStacked()
        .setRange(0, 40)
        .setTitle("Sales per Month")
        .build();

    var uiApp = UiApp.createApplication().setTitle("My Chart");
    uiApp.add(chart);
    return uiApp;

}


function drawChart(dataArr) {
    debug('Loading pie chart');
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
        backgroundColor: 'transparent',
        title: 'Activity Breakdown'
    };
    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(data, options);
}

function draw_percentage_chart() {

    var data = google.visualization.arrayToDataTable([
        ['Effort', 'Amount given'],
        ['My all', 100],
    ]);

    var options = {
        backgroundColor: 'transparent',
        pieHole: 0.5,
        pieSliceTextStyle: {
            color: 'black',
        },
        legend: 'none'
    };

    var chart = new google.visualization.PieChart(document.getElementById('donut_single'));
    chart.draw(data, options);

}


function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}


