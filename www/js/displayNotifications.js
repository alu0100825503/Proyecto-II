function notificationButtonHandler(notifications) {
	url = "http://socialcalendarplus.esy.es/updateReadMessages.php";
	/*
	dataForServer = {
		"sender": notifications[],
		"receiver": ,
		"date": 
	}

	var ajaxRequest = $.post(url, dataForServer, function(returnedData) {
			console.log(returnedData);
			if (returnedData.success) {

			}
			else {

			}
		}, 'json')
		.fail(function() {
			console.log("server connection failed");
		});
		*/
};

$(document).ready(function() {
	console.log("displaying notifications....");

	console.log(localStorage.notifications);
	notifications_obj = JSON.parse(localStorage.notifications);

	var n_messages = 0, 
		n_events = 0, 
		n_contacts = 0;

	// Contar los tipos de notificación
	jQuery.each(notifications_obj.notifications, function(i, val) {
		if (notifications_obj.notifications[i].type == "message") {
			n_messages++;
		} else if (notifications_obj.notifications[i].type == "invitation") {
			n_events++;
		} else if (notifications_obj.notifications[i].type == "friendship") {
			n_contacts++;
		}
	});

	// Empty divs
	if (n_messages > 0) $("#messagesContainer").empty();
	if (n_events > 0) $("#eventsContainer").empty();
	if (n_contacts > 0) $("#contactsContainer").empty();

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
			newMessageButton.click(notificationButtonHandler(notifications));

			// Si el mensaje no ha sido leído, se pone primero en la lista	
			if (val.is_read > 0) {
				$("#messagesContainer").append(newMessageButton);
			} else {
				$("#messagesContainer").prepend(newMessageButton);
				$("#not" + i).css("background-color", "green");
				$("#messagesCollapsible").css("background-color", "green");
			}
	
		} else if (val.type == "invitation") {
			console.log("tiene solicitudes de eventos");

		} else if (val.type == "friendship") {
			console.log("tiene solicitudes de contacto");
			var newContactButton = $('<a id="not' + i + '"data-icon="carat-r" class="ui-btn ui-btn-b ui-icon-carat-r ui-btn-icon-left">' + 
				val.sender + ": <i>" +
				val.message_subject +
				"</i></a>");

			if (val.is_read > 0) {
				$("#contactsContainer").append(newContactButton);
			} else {
				$("#contactsContainer").prepend(newContactButton);
				$("#not" + i).css("background-color", "green");
			}

		} else {
			console.log("notification type not supported");
		}
	});
});