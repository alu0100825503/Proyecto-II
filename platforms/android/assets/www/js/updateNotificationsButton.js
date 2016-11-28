$(document).ready(function() {
	var url = "http://socialcalendarplus.esy.es/getNotifications.php";
	var receiver = localStorage.username;
	var dataForServer = { "receiver": receiver };

	$.post(url, dataForServer, function(returnedData) {
		if (returnedData.success) {
			var notifications = returnedData.notifications;

			// Contar notificaciones no leídas
			var newNotifications = 0;
			jQuery.each(notifications, function(i, val) {
				if (val.is_read <= 0) {
					newNotifications++;
				}
			});

			// Si hay nuevas notificaciones
			if (newNotifications > 0) {
				// Pintar círculo rojo sobre el botón de notificaciones
				$("#notificationsbutton").css("background", "red");
				$("#notificationsbutton").css("-moz-border-radius", "10px");
				$("#notificationsbutton").css("-webkit-border-radius", "100px");
				$("#notificationsbutton").css("border-radius", "100px");
			}
		}
		else {
			console.log("notifications.js: no hay notificaciones nuevas");
			console.log(returnedData);
		}
	}, 'json')
	.fail(function() {
		console.log("notifications.js: the response from the server failed");
	});
});