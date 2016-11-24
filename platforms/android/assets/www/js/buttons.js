function chargePage(page) {
    window.location = page;
}

function logout() {
    localStorage.removeItem("username");
    console.log("logoutbutton");
    // Warning popup
    $("#closeMenu").click();
    setTimeout(function() {
        $("#warningLogout").popup();
        $("#warningLogout").popup("open");
    }, 500);

     $("#agreeLogout").click(function() {
        // Eliminar usuario de la sesión actual
        localStorage.removeItem("username");
        // Redirección a la página principal
        chargePage("index.html");
    });
}

$(document).ready(function() {
    $("#logoutbutton").click(logout);
     $("#logoutbuttonMain").click(logout);

     // Botón home (esquina superior izquierda)
    $("#homebutton").click(function() {
        chargePage("calendar.html");
    });

    $("#notificationsbutton").click(function() {
        chargePage("notifications.html");
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

    $("#mapbutton").click(function() {
        chargePage("map.html");
    });
});
