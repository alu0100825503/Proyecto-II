$(document).ready(function() {
	console.log("displaying notifications....");

	console.log(localStorage.notifications);
	notifications_obj = JSON.parse(localStorage.notifications);

	// Empty divs
	$("#messagesContainer").empty();
	$("#eventsContainer").empty();
	$("#contactsContainer").empty();

	jQuery.each(notifications_obj.notifications, function(i, val) {
		if (val.type == "message") {
			console.log("tiene mensajes");
			var newMessageButton = $('<a data-icon="carat-r" class="ui-btn ui-btn-b ui-icon-carat-r ui-btn-icon-left">' + 
				val.sender + ": <i>" +
				val.message_subject +
				"</i></a>");
			$("#messagesContainer").append(newMessageButton);
	
		} else if (val.type == "invitation") {
			console.log("tiene solicitudes de eventos");

		} else if (val.type == "friendship") {
			console.log("tiene solicitudes de contacto");
			
		} else {

		}
	});
});