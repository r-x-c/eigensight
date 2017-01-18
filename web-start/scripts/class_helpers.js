/**
 * Created by richard on 1/4/17.
 */


Kairos.prototype.get_activity_from_day = function(day_offset){
    var userId = this.auth.currentUser.uid;
    this.timeRef = this.database.ref('timelogs/' + userId + "/" + get_date_key(day_offset));
    this.timeRef.on('value', function (snapshot) {
        return snapshot.val()['lastActivity'];
    });
 };


