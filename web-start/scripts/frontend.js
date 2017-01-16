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

function update_bedtime_frontend(bedtime_in) {
    var bedtime_text = document.getElementById('bedTime');
    bedtime_text.innerHTML = formatAMPM(bedtime_in);


    var sleep_target_text = document.getElementById('sleepTarget');
    sleep_target_text.innerHTML = String(sleep_target / 1000).toHHMMSS();
}

function updateFrontEnd(timeArray, time_key, activity_text) {
    displayArray(timeArray);
    var percentRemaining = ((1 - time_key / SECONDS_IN_DAY) * 100).toFixed(1) + '%';
    document.getElementById("currentActivity").innerHTML = "You have been " + activity_text +
        " since " + String(time_key).toHHMMSS() + ", " + percentRemaining + " of your time today remains";
    document.getElementById("dropdown-topbar").innerHTML = activity_text;
    drawChart(timeArray);
    //Time spent on current activity
    var sec = Math.floor(get_time_key() - time_key);
    //fixme
    clearInterval(timer);
    var timer = setInterval(function () {
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

function display_weather() {
    //http://jsfiddle.net/xxk7S/

    /* Edit these variables */
    var api = "2ea138a9dd52eabe";
    var state = "NY";
    var city = "Bronx";

    state = DEFAULT_STATE;
    city = DEFAULT_CITY;

    debug(state + city);
    $.ajax({
        url: "//api.wunderground.com/api/" + api + "/forecast/conditions/q/" + state + "/" + city + ".json",
        dataType: "jsonp",
        success: function (parsed_json) {
            console.log(parsed_json);
            var icon_url_json = "http://icons.wxug.com/i/c/f/" + parsed_json['current_observation']['icon'] + ".gif";
            var icon_json = '<img src ="' + icon_url_json + '" />';
            var temp_json = parsed_json['current_observation']['temp_f'];
            temp_json += "<span>°F</span>";
            var condition_json = parsed_json['current_observation']['weather'];
            var real_feel_json = "Feels Like " + parsed_json['current_observation']['feelslike_f'] + "°F";
            var wind_json = 'Winds are ' + parsed_json['current_observation']['wind_string'];
            var location_json = city + ', ' + state;
            console.log(parsed_json.forecast.txt_forecast.forecastday);
            console.log("-------");
            for (var some in parsed_json.forecast.txt_forecast.forecastday) {
                // console.log("*************");
                $("#nxtDays").append("<b>" + parsed_json.forecast.txt_forecast.forecastday[some].title + " </b> <br />" +
                    parsed_json.forecast.txt_forecast.forecastday[some].fcttext + "<br />");
                console.log(parsed_json.forecast.txt_forecast.forecastday[some].title);
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
    var quoteSource = [
        {
            quote: "Start by doing what's necessary; then do what's possible; and suddenly you are doing the impossible.",
            name: "Francis of Assisi"
        },
        {
            quote: "He'll run...when he has somewhere to run",
            name: "The Flash's Mom"
        },
        {
            quote: "Believe you can and you're halfway there.",
            name: "Theodore Roosevelt"
        },
        {
            quote: "It does not matter how slowly you go as long as you do not stop.",
            name: "Confucius"
        },
        {
            quote: "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.",
            name: "Thomas A. Edison"
        },
        {
            quote: "The will to win, the desire to succeed, the urge to reach your full potential... these are the keys that will unlock the door to personal excellence.",
            name: "Confucius"
        },
        {
            quote: "Don't watch the clock; do what it does. Keep going.",
            name: "Sam Levenson"
        },
        {
            quote: "A creative man is motivated by the desire to achieve, not by the desire to beat others.",
            name: "Ayn Rand"
        },
        {
            quote: "A creative man is motivated by the desire to achieve, not by the desire to beat others.",
            name: "Ayn Rand"
        },
        {
            quote: "Expect problems and eat them for breakfast.",
            name: "Alfred A. Montapert"
        },
        {
            quote: "Start where you are. Use what you have. Do what you can.",
            name: "Arthur Ashe"
        },
        {
            quote: "Ever tried. Ever failed. No matter. Try Again. Fail again. Fail better.",
            name: "Samuel Beckett"
        },
        {
            quote: "Be yourself; everyone else is already taken.",
            name: "Oscar Wilde"
        },
        {
            quote: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
            name: "Albert Einstein"
        },
        {
            quote: "Always remember that you are absolutely unique. Just like everyone else.",
            name: "Margaret Mead"
        },
        {
            quote: "Do not take life too seriously. You will never get out of it alive.",
            name: "Elbert Hubbard"
        },
        {
            quote: "People who think they know everything are a great annoyance to those of us who do.",
            name: "Isaac Asimov"
        },
        {
            quote: "Procrastination is the art of keeping up with yesterday.",
            name: "Don Marquis"
        },
        {
            quote: "Get your facts first, then you can distort them as you please.",
            name: "Mark Twain"
        },
        {
            quote: "A day without sunshine is like, you know, night.",
            name: "Steve Martin"
        },
        {
            quote: "My grandmother started walking five miles a day when she was sixty. She's ninety-seven now, and we don't know where the hell she is.",
            name: "Ellen DeGeneres"
        },
        {
            quote: "Don't sweat the petty things and don't pet the sweaty things.",
            name: "George Carlin"
        },
        {
            quote: "Always do whatever's next.",
            name: "George Carlin"
        },
        {
            quote: "Atheism is a non-prophet organization.",
            name: "George Carlin"
        },
        {
            quote: "Hapiness is not something ready made. It comes from your own actions.",
            name: "Dalai Lama"
        }

    ];


    $('#quoteButton').click(function (evt) {
        //define the containers of the info we target
        var quote = $('#quoteContainer p').text();
        var quoteGenius = $('#quoteGenius').text();
        //prevent browser's default action
        evt.preventDefault();
        //getting a new random number to attach to a quote and setting a limit
        var sourceLength = quoteSource.length;
        var randomNumber = Math.floor(Math.random() * sourceLength);
        //set a new quote
        for (var i = 0; i <= sourceLength; i += 1) {
            var newQuoteText = quoteSource[randomNumber].quote;
            var newQuoteGenius = quoteSource[randomNumber].name;
            //console.log(newQuoteText,newQuoteGenius);
            var timeAnimation = 500;
            var quoteContainer = $('#quoteContainer');
            //fade out animation with callback
            quoteContainer.fadeOut(timeAnimation, function () {
                quoteContainer.html('');
                quoteContainer.append('<p>' + newQuoteText + '</p>' + '<p id="quoteGenius">' + '-								' + newQuoteGenius + '</p>');

                //fadein animation.
                quoteContainer.fadeIn(timeAnimation);
            });

            break;
        }
        ;//end for loop

    });//end quoteButton function


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
    var today = new Date();
    var h = 23 - today.getHours();
    var m = 59 - today.getMinutes();
    var s = 59 - today.getSeconds();
    var today_in_ms = h * 60 * 60 * 1000 + m * 60 * 1000 + s * 1000;
    return today_in_ms;

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



