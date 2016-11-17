$(document).ready(function() {
    function chargePage(page) {
        window.location = page;
    }

    // Botón home (esquina superior izquierda)
    $("#homebutton").click(function() {
        chargePage("calendar.html");
    });

    $("#calendarbutton").click(function() {
        chargePage("calendar.html");
    });

    $("#profilebutton").click(function() {
        chargePage("profile.html");
    });

    $("#settingsbutton").click(function() {
        chargePage("settings.html");
    });

    $("#aboutbutton").click(function() {
        chargePage("about.html");
    });
});