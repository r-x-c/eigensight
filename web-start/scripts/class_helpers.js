/**
 * Created by richard on 1/4/17.
 */


Kairos.prototype.get_activity_from_day = function(day_offset){
    var userId = this.auth.currentUser.uid;
    this.timeRef = this.database.ref('timelogs/' + userId + "/" + get_time_key(day_offset));
    var data = this.fetch_data(this.timeRef);
    return data[0]['lastActivity'];
 };


Kairos.prototype.fetch_data = function (ref_in) {
    var elements = [];
    ref_in.on('value', function (snapshot) {
        if (snapshot.val() !== null) {
            elements.push(snapshot.val());
        }
        else {
            console.error("Snapshot not found");
            return null;
        }
    });
    return elements;
};
