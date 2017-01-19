/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//http://codepen.io/anon/pen/gLyywR


'use strict';

//Load Dependencies
$.getScript("/scripts/class_helpers.js", function () {

});
$.getScript("/scripts/google_calendar.js", function () {

});

$.getScript("/scripts/helpers.js", function () {

});
$.getScript("/scripts/frontend.js", function () {

});

// Initializes Kairos.
function Kairos() {
    this.checkSetup();
    // Shortcuts to DOM Elements.
    this.messageList = document.getElementById('messages');
    this.messageForm = document.getElementById('message-form');
    this.messageInput = document.getElementById('message');
    this.submitButton = document.getElementById('submit');
    this.submitImageButton = document.getElementById('submitImage');
    this.imageForm = document.getElementById('image-form');
    this.mediaCapture = document.getElementById('mediaCapture');
    this.userPic = document.getElementById('user-pic');
    this.userName = document.getElementById('user-name');
    this.signInButton = document.getElementById('sign-in');
    this.signOutButton = document.getElementById('sign-out');
    this.signInSnackbar = document.getElementById('must-signin-snackbar');
    this.submitActivity = document.getElementById('submit_activity');
    this.activitySelector = document.getElementById('dropdown-options');
    this.resetActivity = document.getElementById('reset_activity_list');
    this.saveBedtime = document.getElementById('set_new_bedtime');
    this.saveSleepTarget = document.getElementById('set_new_sleep_target');

    this.signOutButton.addEventListener('click', this.signOut.bind(this));
    this.signInButton.addEventListener('click', this.signIn.bind(this));
    this.submitActivity.addEventListener('click', this.addActivity.bind(this));
    this.activitySelector.addEventListener('click', this.switch_activity.bind(this));
    this.resetActivity.addEventListener('click', this.reset_activities.bind(this));
    this.saveBedtime.addEventListener('click', this.save_bedtime.bind(this));
    this.saveSleepTarget.addEventListener('click', this.save_sleep_target.bind(this));
    this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
Kairos.prototype.initFirebase = function () {
    // Sets up shortcuts to Firebase features and initiate firebase auth.
    // Shortcuts to Firebase SDK features.
    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();
    // Initiates Firebase auth and listen to auth state changes.
    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Loads chat messages history and listens for upcoming ones.
Kairos.prototype.loadMessages = function () {
    // Reference to the /messages/ database path.
    this.messagesRef = this.database.ref('messages');
    // Make sure we remove all previous listeners.
    this.messagesRef.off();

    // Loads the last 12 messages and listen for new ones.
    var setMessage = function (data) {
        var val = data.val();
        this.displayMessage(data.key, val.name, val.text, val.photoUrl, val.imageUrl);
    }.bind(this);
    this.messagesRef.limitToLast(12).on('child_added', setMessage);
    this.messagesRef.limitToLast(12).on('child_changed', setMessage);

};


// Saves a new message on the Firebase DB.
Kairos.prototype.saveMessage = function (e) {
    e.preventDefault();
    // Check that the user entered a message and is signed in.
    if (this.messageInput.value && this.checkSignedInWithMessage()) {
        var currentUser = this.auth.currentUser;
        // Add a new message entry to the Firebase Database.
        this.messagesRef.push({
            name: currentUser.displayName,
            text: this.messageInput.value,
            photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
        }).then(function () {
            // Clear message text field and SEND button state.
            Kairos.resetMaterialTextfield(this.messageInput);
            this.toggleButton();
        }.bind(this)).catch(function (error) {
            console.error('Error writing new message to Firebase Database', error);
        });
    }
};

// Sets the URL of the given img element with the URL of the image stored in Firebase Storage.
Kairos.prototype.setImageUrl = function (imageUri, imgElement) {
    imgElement.src = imageUri;

    // If the image is a Firebase Storage URI we fetch the URL.
    if (imageUri.startsWith('gs://')) {
        imgElement.src = Kairos.LOADING_IMAGE_URL; // Display a loading image first.
        this.storage.refFromURL(imageUri).getMetadata().then(function (metadata) {
            imgElement.src = metadata.downloadURLs[0];
        });
    } else {
        imgElement.src = imageUri;
    }
};

// Saves a new message containing an image URI in Firebase.
// This first saves the image in Firebase storage.
Kairos.prototype.saveImageMessage = function (event) {
    var file = event.target.files[0];

    // Clear the selection in the file picker input.
    this.imageForm.reset();

    // Check if the file is an image.
    if (!file.type.match('image.*')) {
        var data = {
            message: 'You can only share images',
            timeout: 2000
        };
        this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
        return;
    }
    // Check if the user is signed-in
    if (this.checkSignedInWithMessage()) {
        // We add a message with a loading icon that will get updated with the shared image.
        var currentUser = this.auth.currentUser;
        this.messagesRef.push({
            name: currentUser.displayName,
            imageUrl: Kairos.LOADING_IMAGE_URL,
            photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
        }).then(function (data) {

            // Upload the image to Firebase Storage.
            this.storage.ref(currentUser.uid + '/' + Date.now() + '/' + file.name)
                .put(file, {contentType: file.type})
                .then(function (snapshot) {
                    // Get the file's Storage URI and update the chat message placeholder.
                    var filePath = snapshot.metadata.fullPath;
                    data.update({imageUrl: this.storage.ref(filePath).toString()});
                }.bind(this)).catch(function (error) {
                console.error('There was an error uploading a file to Firebase Storage:', error);
            });
        }.bind(this));
    }
};

// Signs-in Friendly Chat.
Kairos.prototype.signIn = function () {
    // TODO(DEVELOPER): Sign in Firebase with credential from the Google user.
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
};

// Signs-out of Friendly Chat.
Kairos.prototype.signOut = function () {
    this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
Kairos.prototype.onAuthStateChanged = function (user) {
    if (user) { // User is signed in!
        // Get profile pic and user's name from the Firebase user object.
        var profilePicUrl = user.photoURL; // Only change these two lines!
        var userName = user.displayName;   // Only change these two lines!

        // Set the user's profile pic and name.
        this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
        this.userName.textContent = userName;

        // Show user's profile and sign-out button.
        this.userName.removeAttribute('hidden');
        this.userPic.removeAttribute('hidden');
        this.signOutButton.removeAttribute('hidden');

        // Hide sign-in button.
        this.signInButton.setAttribute('hidden', 'true');

        // We load currently existing chat messages.
        this.refresh_page_data();

    } else { // User is signed out!
        // Hide user's profile and sign-out button.
        this.userName.setAttribute('hidden', 'true');
        this.userPic.setAttribute('hidden', 'true');
        this.signOutButton.setAttribute('hidden', 'true');

        // Show sign-in button.
        this.signInButton.removeAttribute('hidden');
    }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
Kairos.prototype.checkSignedInWithMessage = function () {
    // Return true if the user is signed in Firebase
    if (this.auth.currentUser) {
        return true;
    }
    // Display a message to the user using a Toast.
    var data = {
        message: 'You must sign-in first',
        timeout: 2000
    };
    this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return false;
};

// Resets the given MaterialTextField.
Kairos.resetMaterialTextfield = function (element) {
    element.value = '';
    element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};

// Template for messages.
Kairos.MESSAGE_TEMPLATE =
    '<div class="message-container">' +
    '<div class="spacing"><div class="pic"></div></div>' +
    '<div class="message"></div>' +
    '<div class="name"></div>' +
    '</div>';

// A loading image URL.
Kairos.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Displays a Message in the UI.
Kairos.prototype.displayMessage = function (key, name, text, picUrl, imageUri) {
    var div = document.getElementById(key);
    // If an element for that message does not exists yet we create it.
    if (!div) {
        var container = document.createElement('div');
        container.innerHTML = Kairos.MESSAGE_TEMPLATE;
        div = container.firstChild;
        div.setAttribute('id', key);
        this.messageList.appendChild(div);
    }
    if (picUrl) {
        div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
    }
    div.querySelector('.name').textContent = name;
    var messageElement = div.querySelector('.message');
    if (text) { // If the message is text.
        messageElement.textContent = text;
        // Replace all line breaks by <br>.
        messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
    } else if (imageUri) { // If the message is an image.
        var image = document.createElement('img');
        image.addEventListener('load', function () {
            this.messageList.scrollTop = this.messageList.scrollHeight;
        }.bind(this));
        this.setImageUrl(imageUri, image);
        messageElement.innerHTML = '';
        messageElement.appendChild(image);
    }
    // Show the card fading-in.
    setTimeout(function () {
        div.classList.add('visible')
    }, 1);
    this.messageList.scrollTop = this.messageList.scrollHeight;
    this.messageInput.focus();
};

// Enables or disables the submit button depending on the values of the input
// fields.
Kairos.prototype.toggleButton = function () {
    if (this.messageInput.value) {
        this.submitButton.removeAttribute('disabled');
    } else {
        this.submitButton.setAttribute('disabled', 'true');
    }
};

// Checks that the Firebase SDK has been correctly setup and configured.
Kairos.prototype.checkSetup = function () {
    if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
        window.alert('You have not configured and imported the Firebase SDK. ' +
            'Make sure you go through the codelab setup instructions.');
    } else if (config.storageBucket === '') {
        window.alert('Your Firebase Storage bucket has not been enabled. Sorry about that. This is ' +
            'actually a Firebase bug that occurs rarely. ' +
            'Please go and re-generate the Firebase initialisation snippet (step 4 of the codelab) ' +
            'and make sure the storageBucket attribute is not empty. ' +
            'You may also need to visit the Storage tab and paste the name of your bucket which is ' +
            'displayed there.');
    }
};


/*
 //fixme
 if (navigator.geolocation) {
 navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
 }
 //Get the latitude and the longitude;
 function successFunction(position) {
 var lat = position.coords.latitude;
 var lng = position.coords.longitude;
 debug(lat + ' ' + lng);
 }
 function errorFunction() {
 alert("Geocoder failed");
 }
 */

google.charts.load('current', {'packages': ['corechart']});
// google.charts.setOnLoadCallback(draw_percentage_chart);


$("#vert_navbar").on("load", function () {
    // do something once the iframe is loaded
    console.log("iframe loaded");
});

~function () {
    console.log("iframe loaded");
    var loaded = 0;

    $('#vert_navbar, #hori_navbar').load(function () {
        if (++loaded === 2) {
            alert('loaded!');
        }
    });
}();


$(window).on("load", function () {
    console.log("window loaded");
    window.friendlyChat = new Kairos();
    display_weather();
    // Google Cal
    gapi.auth.authorize(
        {client_id: CLIENT_ID, scope: SCOPES, immediate: true},
        handleAuthResult);
    // Set Variables
    document.getElementsByClassName("tablink")[0].click();
    document.getElementById('bedtime_hour').value = 0;
    document.getElementById('bedtime_minute').value = 0;
});


$("ul").on("click", "button", function (e) {
    $(this).unbind("click");
    e.preventDefault();
    if (this.innerHTML == 'delete') {
        console.log("deleting acitivty at index " + $(this).parent().index() - 1);
        try {
            window.friendlyChat.remove_activity($(this).parent().index() - 1);
            $(this).parent().remove();
        }
        catch (err) {
            alert(err);
        }
    }
});

//Constant Globals
var SECONDS_IN_DAY = 86400.0;
var SECOND_IN_MS = 1000;
var MINUTE_IN_MS = 60000;
var HOUR_IN_MS = 3600000;
var DEBUG = true;
var DEFAULT_ACTIVITIES = ["sleeping", "traveling", "studying", "eating", "exercising", "unwinding", "socializing", "grooming"];
var TIMEZONE_OFFSET = 5; //EST
var DEFAULT_BEDTIME = new Date(HOUR_IN_MS * (22 + TIMEZONE_OFFSET) + MINUTE_IN_MS * 30);
var DEFAULT_SLEEP_TARGET = 7 * HOUR_IN_MS + 30 * MINUTE_IN_MS;
var DEFAULT_STATE = 'MI';
var DEFAULT_CITY = 'ann_arbor';
var HOURS_IN_DAY = 24;
var DEFAULT_DISTRIBUTION_GOALS = [7.5 / HOURS_IN_DAY, 1 / HOURS_IN_DAY, 5 / HOURS_IN_DAY, 2.5 / HOURS_IN_DAY, 1.5 / HOURS_IN_DAY, 2 / HOURS_IN_DAY, 3 / HOURS_IN_DAY, 1 / HOURS_IN_DAY];


//Variable Globals
var activity_labels;
var bedtime;
var sleep_target;
var cu_timer;
var distr_goal_arr = DEFAULT_DISTRIBUTION_GOALS;

Kairos.prototype.validate_settings = function (bedTime, sleepTarget, activityArray) {
    debug('Validating settings...');
    if (isNaN(bedTime.getTime())) {
        bedtime = DEFAULT_BEDTIME;
    }
    if (sleepTarget === undefined) {
        sleep_target = DEFAULT_SLEEP_TARGET;
    }
    if (activityArray === null) {
        activity_labels = DEFAULT_ACTIVITIES;
    }
};

Kairos.prototype.update_settings = function (bedTime, sleepTarget, activityArray) {
    debug('Saving settings...');
    var userId = this.auth.currentUser.uid;
    var updates = {};
    updates['/settings/' + userId] = {
        'bed_time': bedTime,
        'sleep_target': sleepTarget,
        'activity_array': activityArray
    };
    return this.database.ref().update(updates);
};

Kairos.prototype.validate_time_data = function (timeArray, lastKey, lastActivity) {
    debug('Validating time data...');
    if (lastActivity === undefined) {
        lastActivity = 0;
    }
    if (lastKey === undefined) {
        lastKey = 0;
    }
    if (timeArray === undefined) {
        debug('foo');
        timeArray = new Array(activity_labels.length).fill(0);
    }
    timeArray.resize(activity_labels.length, 0);
    return [timeArray, lastKey, lastActivity];
};


Kairos.prototype.update_time_data = function (timeArray, lastKey, lastActivity) {
    debug('Saving time data...');
    var userId = this.auth.currentUser.uid;
    var updates = {};

    updates['/timelogs/' + userId + '/' + get_date_key(0)] = {
        'lastKey': lastKey,
        'lastActivity': lastActivity,
        'timeArray': timeArray
    };
    return this.database.ref().update(updates);
};


Kairos.prototype.save_bedtime = function () {
    debug('saving new bedtime to db');
    var bt_hours = document.getElementById('bedtime_hour').value;
    var bt_minutes = document.getElementById('bedtime_minute').value;
    debug(bt_hours + ' ' + bt_minutes);
    var new_bedtime = new Date(new Date().setHours(bt_hours, bt_minutes, 0));
    bedtime = new_bedtime;
    this.update_settings(bedtime, sleep_target, activity_labels);
    update_bedtime_frontend(new_bedtime);
};

Kairos.prototype.save_sleep_target = function () {
    debug('saving new sleep target to db');
    var st_hours = document.getElementById('sleep_target_hour').value;
    var st_minutes = document.getElementById('sleep_target_min').value;
    debug(st_hours + ' ' + st_minutes);
    sleep_target = HOUR_IN_MS * st_hours + MINUTE_IN_MS * st_minutes;
    this.update_settings(bedtime, sleep_target, activity_labels);
    update_bedtime_frontend(bedtime);
};


Kairos.prototype.reset_activities = function () {
    this.update_settings(bedtime, sleep_target, DEFAULT_ACTIVITIES);
};

//Dependencies: Settings Modal
Kairos.prototype.addActivity = function () {
    console.log("appending an activity to settings modal ");
    var x = document.getElementById("new_activity_value");
    var defaultVal = x.defaultValue;
    var currentVal = x.value;
    if (defaultVal != currentVal) {
        currentVal = currentVal.toLowerCase();
        console.log("attempting to add..." + currentVal);
        var userId = firebase.auth().currentUser.uid;
        console.log(userId);
        var activityRef = firebase.database().ref('settings/' + userId);
        var activities = [];
        console.log('foo');
        activityRef.on('value', function (snapshot) {
            if (snapshot.val() !== null) {
                console.log('foo');
                var event = snapshot.val();
                activity_labels = event['activity_array'];
                console.log($.inArray(currentVal, activity_labels));
                if ($.inArray(currentVal, activity_labels) === -1) {
                    console.log("dewfa");
                    activity_labels.push(currentVal);
                    append_li_to_ul(activity_labels);
                }
                else {
                    alert("You already have this activity!");
                }
            }
            else {
                console.log("Snapshot not found,  injecting blank values");
                activity_labels = DEFAULT_ACTIVITIES;
            }
        });
        this.update_settings(bedtime, sleep_target, activity_labels);
        x.value = "";
    }
    else {
        alert("Edit the text field first");
    }
};

Kairos.prototype.remove_activity = function (index) {
    //remove from local array
    if (index > -1) {
        activity_labels.splice(index, 1);
    }
    this.update_settings(bedtime, sleep_target, activity_labels);
};

Kairos.prototype.refresh_page_data = function () {
    console.log("Loading user data");
    var userId = this.auth.currentUser.uid;
    var that = this;

    //Load Custom Activity options
    this.settingRef = this.database.ref('settings/' + userId);
    this.settingRef.on('value', function (snapshot) {
        if (snapshot.val() === null) {
            console.log("no values found, setting blank ones");
            that.update_settings(DEFAULT_BEDTIME, DEFAULT_SLEEP_TARGET, DEFAULT_ACTIVITIES);
        }
        activity_labels = snapshot.val()['activity_array'];
        sleep_target = snapshot.val()['sleep_target'];
        bedtime = new Date(snapshot.val()['bed_time']);
        that.validate_settings(bedtime, sleep_target, activity_labels);
        // that.update_settings(bedtime, sleep_target, activity_labels);
        update_bedtime_frontend(bedtime, sleep_target);
        update_activity_array_frontend(activity_labels);
    });

    //Load Time Data
    this.timeRef = this.database.ref('timelogs/' + userId + "/" + get_date_key(0));
    var timeArray, lastKey, lastActivity;
    this.timeRef.on('value', function (snapshot) {
        if (snapshot.val() === null) {
            console.log("no values found, setting blank ones");
            var last_activity = that.get_activity_from_day(-1);
            debug(activity_labels[last_activity]);
            if (!last_activity) {
                console.log("tried retrieving yesterday's activity idx, failed");
                lastActivity = 0;
            }
        }
        else {
            timeArray = snapshot.val()['timeArray'];
            lastKey = snapshot.val()['lastKey'];
            lastActivity = snapshot.val()['lastActivity'];
        }
        var clean_data = that.validate_time_data(timeArray, lastKey, lastActivity);
        timeArray = clean_data[0];
        lastKey = clean_data[1];
        lastActivity = clean_data[2];
        that.update_time_data(timeArray, lastKey, lastActivity);
        updateFrontEnd(timeArray, lastKey, activity_labels[lastActivity], distr_goal_arr);
    });
};

Kairos.prototype.switch_activity = function (e) {
    debug('Switching Activity...');
    var a = activity_labels.indexOf(e.target.innerHTML);
    this.selectActivity(a);
    // document.getElementById('dropdown-options').style.visibility='hidden';
    // document.getElementById('dropdown-options').style.visibility='visible';
};

Kairos.prototype.selectActivity = function (activity_index) {
    debug('Updating to ' + activity_labels[activity_index] + ', writing into database...');
    var date_key = get_date_key(0);
    var time_key = get_time_key();
    var userId = this.auth.currentUser.uid;
    var timeDataRef = this.database.ref('timelogs/' + userId + "/" + date_key);
    var timelineRef = this.database.ref('timelines/' + userId + "/" + date_key);
    var that = this;

    //record order of activities during day
    timelineRef.push({
        'timekey': time_key,
        'activity': activity_labels[activity_index],
    });

    var storedActivity, storedKey, storedTimeArr;
    timeDataRef.on('value', function (snapshot) {
        if (snapshot.val() !== null) {
            var event = snapshot.val();
            storedActivity = event['lastActivity'];
            storedKey = event['lastKey'];
            storedTimeArr = event['timeArray'];
            storedTimeArr[storedActivity] += (time_key - storedKey);
        }
        else {
            console.error('Time data was not loaded properly');
            this.refresh_page_data();
        }
    });
    var clean_data = this.validate_time_data(storedTimeArr, time_key, activity_index);
    storedTimeArr = clean_data[0];
    storedKey = clean_data[1];
    storedActivity = clean_data[2];
    updateFrontEnd(storedTimeArr, storedKey, storedActivity, distr_goal_arr);
    this.update_time_data(storedTimeArr, storedKey, storedActivity);
    document.getElementById('dropdown-options').style.display = 'none';
};




