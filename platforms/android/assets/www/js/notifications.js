$(document).ready(function() {
	console.log("notifications");

	var url = "http://socialcalendarplus.esy.es/getNotifications.php";
	var receiver = localStorage.username;
	console.log("retrieving info for " + receiver);
	dataForServer = { "receiver": receiver };

	var ajaxRequest = $.post(url, dataForServer, function(returnedData) {
			if (returnedData.success) {
				// Guardar el objeto json de notificaciones en
				// localStorage para hacerlo accesible a notifications.html
				console.log("returnedData: " + returnedData);
				localStorage.notifications = JSON.stringify(returnedData);
				// Poner el número de notificaciones sobre el botón de notificaciones	
				// en rojo
				// .....
				// if (es calendar.html) { actualizamos icono de mensajes }
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