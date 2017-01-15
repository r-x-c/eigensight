/**
 * Created by richard on 1/10/17.
 */

    // Your Client ID can be retrieved from your project in the Google
    // Developer Console, https://console.developers.google.com
var CLIENT_ID = '985096514625-4uhpffki38dgrc6efi0pefj9vhhc0i3q.apps.googleusercontent.com';

var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
    gapi.auth.authorize(
        {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
        }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        authorizeDiv.style.display = 'none';
        loadCalendarApi();
    } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDiv.style.display = 'inline';
    }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
    gapi.auth.authorize(
        {client_id: CLIENT_ID, scope: SCOPES, immediate: true},
        handleAuthResult);
    return false;
}

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi() {
    gapi.client.load('calendar', 'v3', listUpcomingEvents);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
    var request = gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    });

    request.execute(function (resp) {
        var events = resp.items;
        appendPre("Today's Agenda");

        var calendar_hours_today = 0;
        var pending_calendar_hours = 0;

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = new Date(event.start.dateTime);
                var end = new Date(event.end.dateTime);
                var start = new Date(when);
                if (!when) {
                    when = event.start.date;
                }

                // Get today's date
                var todaysDate = new Date();
                //Today
                if (when.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)) {
                    calendar_hours_today += (end - start);
                    appendPre(event.summary + ' (at ' + formatAMPM(start) + ' for ' + msToTime(end - start) + ')');
                    debug(todaysDate);
                    debug(start);
                    debug(end);
                    //event has passed or begun
                    if (todaysDate > start) {
                        debug("event has already passed");
                        //currently in session
                        if (end > todaysDate) {
                            debug("but still in session");
                            //adjustment to not overflow bedtime
                            if ((end.getHours() * 60 + end.getMinutes()) > (bedtime.getHours() * 60 + bedtime.getMinutes()) || end.getDate() !== todaysDate.getDate()) {
                                end = todaysDate;
                                end.setHours(bedtime.getHours(), bedtime.getMinutes());
                            }
                            //cut off passed time
                            start.setHours(todaysDate.getHours(), todaysDate.getMinutes());
                            pending_calendar_hours += (end - start);
                        }
                    }
                    //event is in future
                    else {
                        debug("event has not begun ");
                        //adj to not overflow bedtime
                        if ((end.getHours() * 60 + end.getMinutes()) > (bedtime.getHours() * 60 + bedtime.getMinutes()) || end.getDate() !== todaysDate.getDate()) {
                            end = todaysDate;
                            end.setHours(bedtime.getHours(), bedtime.getMinutes());
                        }
                        pending_calendar_hours += (end - start);
                    }
                }
                else {
                    //only worry about events happening today
                    break;
                }

            }
        } else {
            appendPre('No upcoming events found.');
        }
        // console.log("total calendar hours today");
        // console.log(msToTime(calendar_hours_today));
        // console.log("pending cal hrs");
        // console.log(msToTime(pending_calendar_hours));

        //frontend
        var h_text = document.getElementById('calendarTime');
        h_text.innerHTML = 'today you have ' + msToTime(calendar_hours_today) + ' of scheduled events on your calendar';
        var bedtime_text = document.getElementById('bedTime');
        bedtime_text.innerHTML = formatAMPM(bedtime);
        var foo = document.getElementById('pendingCalendarTime');
        if(pending_calendar_hours > 0){
            debug(pending_calendar_hours);
            foo.innerHTML = 'before you sleep you still have ' + msToTime(pending_calendar_hours) + ' of events today';
        }
        else{

            foo.innerHTML = 'you have no events left :)';
        }
    });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}



