$(document).ready(function() {
    document.getElementById("userFoundName").innerHTML = localStorage.getItem("userFound");    // Name

    $('<img src="img/standar-face.png" hspace=30 style="width:30%"/>').appendTo($("#headMainContent"));
    // If es amigo muestro uno, sino otro
    $('<button type="button" onClick="" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-a ui-btn-icon-right ui-icon-plus" style="float: right;"></button>').
                    text("Añadir amigo").appendTo($("#headMainContent"));
    // Else
    /*
    $('<button type="button" onClick="" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-a ui-btn-icon-right ui-icon-delete"></button>').
                    text("Añadir amigo").appendTo($("#headMainContent"));
    */
});