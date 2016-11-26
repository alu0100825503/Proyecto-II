function deleteNotificationFromDB(notificationData) {
	console.log("deleting notification from DB");
	url = "http://socialcalendarplus.esy.es/removeNotification.php"
	dataForServer = {
		"sender": notificationData.sender,
		"receiver": notificationData.receiver,
		"date": notificationData.date
	};

	$.post(url, dataForServer, function(returnedData) {
		if (returnedData.success) {
			console.log("notification deleted");
		} else {
			console.log("notification not deleted");
			console.log("returnedData: " + returnedData);
		}
	}, 'json')
	.fail(function() {
		console.log("server connection failed while deleting");
	});
	console.log(JSON.stringify(dataForServer));
}

function saveContactsInDB(notification) {
	url = "http://socialcalendarplus.esy.es/addContact.php";
	dataForServer = {
		"user1": notification.sender,
		"user2": notification.receiver
	};

	$.post(url, dataForServer, function(returnedData) {
		if (returnedData.success) {
			console.log("contactos guardados");
			deleteNotificationFromDB({ sender: event.data.sender, receiver: event.data.receiver, date: event.data.date});
		} else {
			console.log("sin éxito al guardar contactos");
			console.log("returnedData: " + returnedData);
		}	 
	}, 'json')
	.fail(function() {
		console.log("server connection failed while saving contacts");
	});	
}

function notificationButtonHandler(event) {
	url = "http://socialcalendarplus.esy.es/updateReadMessages.php";

	var buttonClickedId = this.id;
	var notIndex = buttonClickedId.match(/\d+/g);
	var notification = event.data.notification;
	console.log(notification);
	
	dataForServer = {
		"sender": notification.sender,
		"receiver": notification.receiver,
		"date": notification.date
	}

	// Remove color green from the button clicked
	$(this).css("background-color", "");

	// Marcar como leída en la base de datos
	var ajaxRequest = $.post(url, dataForServer, function(returnedData) {
			if (returnedData.success) {
				console.log();
			}
			else {
				console.log("update did not success");
				console.log("returnedData: " + returnedData);	
			}
		}, 'json')
		.fail(function() {
			console.log("server connection failed");
		});

	// Categorizar las notificaciones que nos llegan del servidor	
	if (notification.type == "message") {
		$("#messageSubject").empty();
		$("#messageDate").empty();
		$("#messageFrom").empty();
		$("#messageTo").empty();
		$("#messageText").empty();

		$("#messageSubject").append("<strong>Asunto: </strong>" + notification.message_subject);
		$("#messageDate").append("<strong>Fecha: </strong>" + notification.date);
		$("#messageFrom").append("<strong>De: </strong>" + notification.sender);
		$("#messageTo").append("<strong>Para: </strong>" + notification.receiver);
		$("#messageText").append("<i>" + notification.message_content + "</i>");
		$("#messageViewer").popup();
		$("#messageViewer").popup("open");	

		$("#replyMessage").click(function() {
			console.log("redirigiendo a la página de perfil del emisor");
		});
		$("#deleteMessage").click(function() {
			console.log("eliminando notificación de la base de datos");
			deleteNotificationFromDB(notification);
			location.reload();
		});
	} else if (notification.type == "friendship") {
		$("#contactSender").empty();
		$("#contactSender").append("<strong>Usuario: </strong>" + notification.sender);
		$("#contactViewer").popup();
		$("#contactViewer").popup("open");
		
		$("#acceptContact").click(function() {
			saveContactsInDB(notification);
		});
		$("#rejectContact").click(function() {
			deleteNotificationFromDB(notification);
			//location.reload();
		});	
	} else if (notification.type == "invitation") {
		console.log("manejo de eventos sin implementar");
	}
};

$(document).ready(function() {
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

	// Organizar las notificaciones en las categorías
	jQuery.each(notifications_obj.notifications, function(i, val) {
		notifications.push(val);
		if (val.type == "message") {
			var newMessageButton = $('<a id="not' + i + '"data-icon="carat-r" class="ui-btn ui-btn-b ui-icon-carat-r ui-btn-icon-left">' + 
				val.sender + ": <i>" +
				val.message_subject +
				"</i></a>");

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

	// Setting listener for all notifications buttons
	for (i = 0; i < notifications.length; i++) { 
    	$("#not" + i).click({ notification: notifications[i] }, notificationButtonHandler);
	}
});