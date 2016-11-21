function searchUser() {
    var userToSearch = [{
        "username": document.getElementById("nameUserSearch").value
    }]
    document.getElementById("nameUserSearch").value = "";

    var dataJSON = JSON.stringify(userToSearch);
    var url = "http://socialcalendarplus.esy.es/searchUser.php";

    // Add users found to the popup
    $.getJSON(url, { eventData: dataJSON }, function (eventsReceived) {
        $.each(eventsReceived, function (i, event) {
            $('<button type="button" onClick="" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-btn-icon-right ui-icon-forward"></button>').
            text(event.username).appendTo($("#userFound"));
        });
    });
}