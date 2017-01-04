/**
 * Created by richard on 1/4/17.
 */

Kairos.prototype.load_data_from_ref = function (ref_in) {
    var events;
    ref_in.on('value', function (snapshot) {
        if (snapshot.val() !== null) {
            var event = snapshot.val();
            events.push(event);
        }
        else {
            console.error("Snapshot not found,  injecting blank values");
        }
    });
    return events;
};

