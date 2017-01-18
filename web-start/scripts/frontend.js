/**
 * Created by richard on 12/24/16.
 */
function pad(val) {
    return val > 9 ? val : "0" + val;
}

function foo(id, change) {
    var value = parseInt(document.getElementById(id).value, 10);
    value = isNaN(value) ? 0 : value;
    value += change;
    document.getElementById(id).value = value;
    document.getElementById(id).innerHTML = value;
}

function update_bedtime_frontend(bedtime_in, sleep_target_in) {
    var bedtime_text = document.getElementById('bedTime');
    bedtime_text.innerHTML = formatAMPM(bedtime_in);
    var sleep_target_text = document.getElementById('sleepTarget');
    sleep_target_text.innerHTML = String(sleep_target_in / 1000).toHHMMSS();

    //Countdown for day
    var today_in_ms = get_remainder_ms();
    var deadline = new Date(Date.parse(new Date()) + today_in_ms);
    initializeClock('clockdiv', deadline);

}

function update_activity_array_frontend(activity_labels) {

    append_li_to_ul(activity_labels);
    var activity_list_frontend = document.getElementById('dropdown-options');
    $('#dropdown-options').find('a').remove();
    for (var i = 0; i < activity_labels.length; i++) {
        var a = document.createElement("a");
        a.innerHTML = activity_labels[i];
        a.setAttribute("name", "activity_obj");
        a.setAttribute("class", "activity_obj");
        activity_list_frontend.appendChild(a);
    }


}


function updateFrontEnd(timeArray, time_key, activity_text) {
    displayArray(timeArray);
    var waking_seconds_in_day = SECONDS_IN_DAY - (sleep_target / 1000);
    debug(bedtime);
    debug('% awake' + waking_seconds_in_day / SECONDS_IN_DAY);
    debug('sec in a day');
    debug(get_time_key(bedtime) - time_key);
    debug((get_time_key(bedtime) - time_key) / waking_seconds_in_day);
    debug((get_time_key(bedtime) - time_key) / SECONDS_IN_DAY);
    var percentRemaining = (((get_time_key(bedtime) - time_key) / SECONDS_IN_DAY) * 100).toFixed(1) + '%';

    document.getElementById("currentActivity").innerHTML = activity_text +
        " since " + String(time_key).toHHMMSS() + ", " + percentRemaining + " of your time today remains";
    document.getElementById("dropdown-topbar").innerHTML = activity_text;
    drawChart(timeArray);
    draw_percentage_chart();

    //Time spent on current activity
    var sec = Math.floor(get_time_key() - time_key);
    clearInterval(cu_timer);
    cu_timer = setInterval(function () {
        document.getElementById("cu_timer").innerHTML = pad(parseInt(sec / 3600, 10)) + ':' + pad(parseInt(sec / 60, 10) % 60) + ':' + pad(++sec % 60);
    }, 1000);
    setTimeout(function () {
        clearInterval(timer);
    }, 1 * HOUR_IN_MS);

    //timeout to remind you to change activities
    setTimeout(myFunction, MINUTE_IN_MS * 45);
}


function openCity(evt, cityName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("city");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].classList.remove("w3-light-grey");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.classList.add("w3-light-grey");
}


function retrieve_gov_weather() {

}


function display_weather() {
    //http://jsfiddle.net/xxk7S/

    /* Edit these variables */
    var api = "2ea138a9dd52eabe";
    var state = "NY";
    var city = "Bronx";

    state = DEFAULT_STATE;
    city = DEFAULT_CITY;

    debug('Loading weather data for ' + state + ', ' + city);
    $.ajax({
        url: "//api.wunderground.com/api/" + api + "/forecast/conditions/q/" + state + "/" + city + ".json",
        dataType: "jsonp",
        success: function (parsed_json) {
            // console.log(parsed_json);
            var icon_url_json = "//icons.wxug.com/i/c/f/" + parsed_json['current_observation']['icon'] + ".gif";
            var icon_json = '<img src ="' + icon_url_json + '" />';
            var temp_json = parsed_json['current_observation']['temp_f'];
            temp_json += "<span>°F</span>";
            var condition_json = parsed_json['current_observation']['weather'];
            var real_feel_json = "Feels Like " + parsed_json['current_observation']['feelslike_f'] + "°F";
            var wind_json = 'Winds are ' + parsed_json['current_observation']['wind_string'];
            var location_json = city + ', ' + state;
            // console.log(parsed_json.forecast.txt_forecast.forecastday);
            // console.log("-------");
            for (var some in parsed_json.forecast.txt_forecast.forecastday) {
                // console.log("*************");
                $("#nxtDays").append("<b>" + parsed_json.forecast.txt_forecast.forecastday[some].title + " </b> <br />" +
                    parsed_json.forecast.txt_forecast.forecastday[some].fcttext + "<br />");
                // console.log(parsed_json.forecast.txt_forecast.forecastday[some].title);
            }
            document.getElementById("weather-icon").innerHTML = icon_json;
            // document.getElementById("temp").innerHTML = temp_json;
            // document.getElementById("condition").innerHTML = condition_json;
            document.getElementById("real-feel").innerHTML = real_feel_json;
            document.getElementById("wind").innerHTML = wind_json;
            document.getElementById("location").innerHTML = location_json;
        }
    });
}


function myFunction() {
    alert('Its been 45 minutes, want to try something else? be sure to keep your activities updated');
}


function changeObjectView(id) {
    var pie = document.getElementById(id);

    if (pie.style.display == 'none') {
        $(pie).fadeIn('fast');
    }
    else {
        $(pie).fadeOut('fast');
    }
}


$(document).ready(function () {




});//end document ready


function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

function initializeClock(id, endtime) {
    var clock = document.getElementById(id);
    // var daysSpan = clock.querySelector('.days');
    var hoursSpan = clock.querySelector('.hours');
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');

    function updateClock() {
        var t = getTimeRemaining(endtime);

        // daysSpan.innerHTML = t.days;
        hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
        minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
        secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

        if (t.total <= 0) {
            clearInterval(timeinterval);
        }
    }

    updateClock();
    var timeinterval = setInterval(updateClock, 1000);
}

function get_remainder_ms() {
    return new Date().setHours(bedtime.getHours(), bedtime.getMinutes(), 0) - new Date();
}

function append_li_to_ul(activity_array) {
    var ul = document.getElementById("adjust_activities");
    $('#adjust_activities').find('li').not('li:first').remove();
    for (i = 0; i < activity_array.length; i++) {
        var li = document.createElement("li");
        var label = document.createElement("label");
        var button = document.createElement("button");
        // var button_format =  create('<i class="mdl-color-text--blue-grey-400 material-icons"' +
        //     ' role="presentation">delete</i>');
        button.innerHTML = "delete";
        // button.appendChild(button_format);
        label.innerHTML = activity_array[i];
        li.appendChild(label);
        li.appendChild(button);
        ul.appendChild(li);
    }
}

jQuery(document).ready(function () {

    // This button will increment the value
    $('.paxplus').click(function (e) {
        debug('incrementing');
        // Stop acting like a button
        e.preventDefault();

        // Get the field name
        fieldName = $(this).attr('field');
        // Get its default input
        var defaultInp = jQuery('input[name=' + fieldName + ']');
        // Get its min value
        var minVal = jQuery('input[name=' + fieldName + ']').data('min');
        // Get its current value
        var currentVal = parseInt($('input[name=' + fieldName + ']').val());
        // If is not undefined
        if (!isNaN(currentVal)) {
            // Increment
            if (defaultInp.val() < jQuery(defaultInp).data('max'))
            //if I put "var _val = " here
            //I get - [object Object] Chocolate. Why?
                $('input[name=' + fieldName + ']').val(currentVal + 1);
            //save for display in ext div
            var _val = currentVal + 1;
            //show in div
            //$(".count-pax").text(_val+' '+fieldName);
            console.log(currentVal);
            if (defaultInp.val() == jQuery(defaultInp).data('max'))
                $(this).prop('disabled', true);
            $(".paxminus").removeAttr("disabled");
        } else {
            // Otherwise put a 0 there

            $('input[name=' + fieldName + ']').val(0);
        }
    });
    // This button will decrement the value till 0
    $(".paxminus").click(function (e) {
        debug('decrementing');

        // Stop acting like a button
        e.preventDefault();

        // Get the field name
        fieldName = $(this).attr('field');
        // Get its default input
        var defaultInp = jQuery('input[name=' + fieldName + ']');
        // Get its min value
        var minVal = jQuery('input[name=' + fieldName + ']').data('min');
        // Get its current value
        var currentVal = parseInt($('input[name=' + fieldName + ']').val());
        // If it isn't undefined or its greater than 0
        if (!isNaN(currentVal) && currentVal > 0) {
            // Decrement one
            if (defaultInp.val() > minVal)
            //if I put "var _val = " here
            //I get - [object Object] Chocolate. Why?
                $('input[name=' + fieldName + ']').val(currentVal - 1);
            var _val = currentVal - 1;
            //$(".count-pax").text(_val+' '+fieldName);
            if (defaultInp.val() == jQuery(defaultInp).data('min'))
                $(this).prop('disabled', true);
            $(".paxplus").removeAttr("disabled");
        } else {
            // Otherwise put a 0 there

            $('input[name=' + fieldName + ']').val(0);
        }
    });
    // $('#myform').bind('click', function (e) {
    //     e.stopPropagation()
    // });
    $('#sleep_target').bind('click', function (e) {
        e.stopPropagation()
    });
});




