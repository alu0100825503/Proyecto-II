$(document).ready(function() {
	console.log("notifications");

	var url = "http://socialcalendarplus.esy.es/getNotifications.php";
	var receiver = localStorage.username;
	console.log("retrieving info for " + receiver);
	dataForServer = { "receiver": receiver };

	var ajaxRequest = $.post(url, dataForServer, function(returnedData) {
			if (returnedData.success) {
				// Guardar el objeto json de notificaciones en
				// localStorage para hacerlo accesible a diplayNotifications.js
				localStorage.notifications = JSON.stringify(returnedData);
				console.log("returnedData in success: " + JSON.stringify(returnedData));
				// Contar notificaciones no leídas
				var newNotifications = 0;
				jQuery.each(returnedData.notifications, function(i, val) {
					if (val.is_read <= 0) {
						newNotifications++;
					}
				});

				if (newNotifications > 0) {
					// Pintar círculo rojo sobre el botón de notificaciones
					$("#notificationsbutton").css("background", "red");
					$("#notificationsbutton").css("-moz-border-radius", "10px");
					$("#notificationsbutton").css("-webkit-border-radius", "100px");
					$("#notificationsbutton").css("border-radius", "100px");
					//console.log("Nuevas notificaciones: " + newNotifications);
				}
			}
			else {
				console.log("not success in the json");
				console.log(returnedData);
			}
		}, 'json')
		.fail(function() {
			console.log("the response from the server failed");
		});
});