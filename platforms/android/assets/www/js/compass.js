// PhoneGap is ready
function onDeviceReady() {
    startWatch();
}

// Start watching the compass
function startWatch() {
    // Update compass every 1 seconds
    var options = { frequency: 1000 };
    watchID = navigator.compass.watchHeading(onSuccess, onError, options);
}

// Stop watching the compass
function stopWatch() {
    if (watchID) {
        navigator.compass.clearWatch(watchID);
        watchID = null;
    }
}

// onSuccess: Get the current heading
function onSuccess(heading) {
    $("#measureVal").text(heading.trueHeading);
    $("#measure").text("GRADOS");
}

// onError: Failed to get the heading
function onError() {
    alert('onError!');
}

$(document).ready(function() {
    // The watch id references the current `watchHeading`
    var watchID = null;

    $("#compassButton").click(function() {
        if ($(this).val() == "Medir") {
            $(this).val("Detener");
            $(this).button("refresh");
            document.addEventListener("deviceready", onDeviceReady, false);
        } 
        else {
            $(this).val("Medir");
            $(this).button("refresh");
            stopWatch();
        }
    }); 
});