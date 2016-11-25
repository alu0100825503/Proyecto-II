$(document).ready(function() {
	console.log("displaying notifications....");

	console.log(localStorage.notifications);
	notifications_obj = JSON.parse(localStorage.notifications);

	// Empty divs
	$("#messagesContainer").empty();
	//$("#eventsContainer").empty();
	$("#contactsContainer").empty();

	// Getting total number of notifications
	console.log(Object.keys(notifications_obj.notifications).length);

	var notifications = [];

	jQuery.each(notifications_obj.notifications, function(i, val) {
		notifications.push(val);
		if (val.type == "message") {
			console.log("tiene mensajes");
			var newMessageButton = $('<a id="not' + i + '"data-icon="carat-r" class="ui-btn ui-btn-b ui-icon-carat-r ui-btn-icon-left">' + 
				val.sender + ": <i>" +
				val.message_subject +
				"</i></a>");

			// Si el mensaje no ha sido leído, se pone primero en la lista	
			if (val.is_read) {
				$("#messagesContainer").append(newMessageButton);
			} else {
				$("#messagesContainer").prepend(newMessageButton);
			}
			
	
		} else if (val.type == "invitation") {
			console.log("tiene solicitudes de eventos");

		} else if (val.type == "friendship") {
			console.log("tiene solicitudes de contacto");
			var newContactButton = $('<a id="not' + i + '"data-icon="carat-r" class="ui-btn ui-btn-b ui-icon-carat-r ui-btn-icon-left">' + 
				val.sender + ": <i>" +
				val.message_subject +
				"</i></a>");

			if (val.is_read) {
				$("#contactsContainer").append(newContactButton);
			} else {
				$("#contactsContainer").prepend(newContactButton);
			}

		} else {
			console.log("notification type not supported");
		}
	});
});