$(document).ready(function() {
	console.log("displaying notifications...");

	console.log(localStorage.notifications);
	notifications_obj = JSON.parse(localStorage.notifications);

	jQuery.each(notifications_obj.notifications, function(i, val) {
		if (val.type == "message") {
			console.log("tiene mensajes");
		
		} else if (val.type == "invitation") {
			console.log("tiene solicitudes de eventos");

		} else if (val.type == "friendship") {
			console.log("tiene solicitudes de contacto");
			
		} else {

		}
	});
});