$(document).ready(function() {
	console.log("displaying notifications....");

	console.log(localStorage.notifications);
	notifications_obj = JSON.parse(localStorage.notifications);

	messagesSection = $("#messagesCollapsible");
	eventsSection = $("#eventsCollapsible");
	contactsSection = $("#contactsCollapsible");

	jQuery.each(notifications_obj.notifications, function(i, val) {
		if (val.type == "message") {
			console.log("tiene mensajes");
			var newMessageButton = $('<a class="ui-btn ui-btn-b ui-icon-delete ui-btn-icon-left">' + val.sender + ": <i>" + val.message_subject + "</i></a>");
			$("#messagesContainer").append(newMessageButton);
			//messagesSection.collapsible();

		} else if (val.type == "invitation") {
			console.log("tiene solicitudes de eventos");

		} else if (val.type == "friendship") {
			console.log("tiene solicitudes de contacto");
			
		} else {

		}
	});
});