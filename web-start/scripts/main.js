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
$.getScript("/scripts/helpers.js", function () {

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

    // Saves message on form submit.
    this.messageForm.addEventListener('submit', this.saveMessage.bind(this));
    this.signOutButton.addEventListener('click', this.signOut.bind(this));
    this.signInButton.addEventListener('click', this.signIn.bind(this));

    //fixme:
    this.submitActivity.addEventListener('click', this.addActivity.bind(this));

    // Toggle for the button.
    var buttonTogglingHandler = this.toggleButton.bind(this);
    this.messageInput.addEventListener('keyup', buttonTogglingHandler);
    this.messageInput.addEventListener('change', buttonTogglingHandler);

    // Events for image upload.
    this.submitImageButton.addEventListener('click', function () {
        this.mediaCapture.click();
    }.bind(this));
    this.mediaCapture.addEventListener('change', this.saveImageMessage.bind(this));

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

        // We load currently existing chant messages.
        this.loadMessages();
        //fixme:
        // this.loadTimes();
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

window.onload = function () {
    window.friendlyChat = new Kairos();
    startTime();
    // console.log("fix this error! below doesn't owkr");

    // window.friendlyChat.loadData();
    // Kairos.prototype.loadData();
};

//fixme: runs this twice
/*
 $("ul").on("click", "button", function (e) {
 $(this).unbind("click");
 e.preventDefault();
 // console.log($(this).parent());
 if (this.innerHTML == 'delete') {
 console.log("deleting stuff @ " + $(this).parent().index());
 $(this).parent().remove();
 }
 else if (this.innerHTML == 'add') {
 var x = document.getElementById("new_activity_value");
 var defaultVal = x.defaultValue;
 var currentVal = x.value;
 var foobar = new Kairos();
 if (defaultVal != currentVal) {
 console.log("calling kairos func");
 foobar.addActivity(currentVal);
 Kairos.prototype.addActivity(currentVal);
 }
 else {
 alert("enter a val first please");
 }

 }
 });
 */

var SECONDS_IN_DAY = 86400.0;
var activityLabels = ["sleeping", "traveling", "studying", "eating", "exercising", "unwinding", "socializing", "grooming"];
var DEFAULT_ACTIVITIES = ["sleeping", "traveling", "studying", "eating", "exercising", "unwinding", "socializing", "grooming"];

var ACTIVITY_SIZE = activityLabels.length;

Kairos.prototype.addActivity = function () {
    var x = document.getElementById("new_activity_value");
    var defaultVal = x.defaultValue;
    var currentVal = x.value.toLowerCase();
    if (defaultVal != currentVal) {
        console.log("attempting to add..." + currentVal);
        var userId = firebase.auth().currentUser.uid;
        console.log(userId);
        var activityRef = firebase.database().ref('activities/' + userId);
        // var foo = firebase.database().ref().child('activities/' + userId).push().key;
        // console.log(foo);
        // activityRef.push({
        //     'activity_array': currentVal
        // });
        var activities = [];
        var read_activity_array;
        console.log('foo');
        activityRef.on('value', function (snapshot) {
            if (snapshot.val() !== null) {
                console.log('foo');
                var event = snapshot.val();
                read_activity_array = event['activity_array'];
                read_activity_array.push(currentVal);
                console.log(read_activity_array);
                return;
            }
            else {
                console.log("Snapshot not found,  injecting blank values");
                activityRef.set({'activity_array': DEFAULT_ACTIVITIES});
            }
            // activities.push(snapshot.val());
            //Do something with the data
        });
        activityRef.set({'activity_array': read_activity_array});
        var activities_in_modal = document.getElementById("adjust_activities");
        for (var i = 0; i < read_activity_array.length; i++) {
            text += cars[i] + "<br>";
        }

    }
    else {
        alert("enter a val first please");
    }
};
//todo: delete activity


Kairos.prototype.loadData = function () {
    var userId = firebase.auth().currentUser.uid;
    console.log(userId);
    var timeDataRef = firebase.database().ref('timelogs/' + userId + "/" + get_time_key(0));
    console.log(timeDataRef);
    console.log('end loadData');
};


Kairos.prototype.selectActivity = function (activity_index) {
    // console.log("foobar"+activity_idx);
    // var selector = document.getElementById("activitySelector");
    // var activity_index = Number(selector.options[selector.selectedIndex].value);
    var n = new Date();
    var date_key = get_time_key(0);
    var time_key = (n.getMilliseconds() * .001) + n.getSeconds() + (n.getMinutes() * 60) + (n.getHours()) * 3600;
    var userId = firebase.auth().currentUser.uid;
    var timeDataRef = firebase.database().ref('timelogs/' + userId + "/" + date_key);
    var timelineRef = firebase.database().ref('timelines/' + userId + "/" + date_key);

    timelineRef.push({
        'timekey': time_key,
        'activity': activity_index,
    });

    console.log("Begin DB read");
    // var events = [];
    var storedActivity, storedKey, storedTimeArr;
    timeDataRef.on('value', function (snapshot) {
        //todo: this function calls 3 times
        console.log("foobar");
        if (snapshot.val() !== null) {
            var event = snapshot.val();
            storedActivity = event['lastActivity'];
            storedKey = event['lastKey'];
            storedTimeArr = event['timeArray'];
            storedTimeArr[storedActivity] += (time_key - storedKey);
            updateFrontEnd(storedTimeArr, time_key, activityLabels[activity_index]);
        }
        else {
            console.error("Snapshot not found,  injecting blank values");
            timeDataRef.set({
                'lastKey': time_key,
                'lastActivity': activity_index,
                'timeArray': new Array(ACTIVITY_SIZE).fill(0)
            });
            storedKey = time_key;
            storedActivity = activity_index;
            storedTimeArr = new Array(ACTIVITY_SIZE).fill(0);

        }
        console.log("Array: " + JSON.stringify(storedTimeArr));
        console.log("Activity Idx: " + storedActivity);
        console.log("Key: " + storedKey);
    });


    //Write to DB
    timeDataRef.update({
        'lastKey': time_key,
        'lastActivity': Number(activity_index),
        'timeArray': storedTimeArr
    });

    console.log("end DB read");
    //todo: math from yesterday
    // var yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    // console.log(yesterday);
    // var historicalRef = firebase.database().ref('timelogs/' + userId + "/" + yesterday);

    //fixme smooth calculations between days, temp calc
    // lastActivity = 0;
    // lastKey = time_key;
    // lastTimeArr = new Array(selector.length).fill(0);
    // }

};

function updateFrontEnd(timeArray, time_key, activity_text) {
    console.log("Array: " + JSON.stringify(timeArray));
    //Write to table
    //Create Pie Chart
    $.when(displayArray(timeArray)).then(drawChart(timeArray));

    var percentRemaining = ((1 - time_key / SECONDS_IN_DAY) * 100).toFixed(1) + '%';
    document.getElementById("currentActivity").innerHTML = "You have been " + activity_text +
        " since " + String(time_key).toHHMMSS() + ", " + percentRemaining + " of your time today remains";

    document.getElementById("dropdown-topbar").innerHTML = activity_text;

}

var SECOND_IN_MS = 1000;
var MINUTE_IN_MS = 60000;
var HOUR_IN_MS = 3600000;

setInterval(function () {
    alert("Hi! How do you feel? Please keep your activities updated");
}, HOUR_IN_MS);

