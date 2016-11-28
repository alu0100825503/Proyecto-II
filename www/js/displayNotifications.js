function deleteNotificationFromDB(notification) {
	console.log("deleting notification from DB");
	url = "http://socialcalendarplus.esy.es/removeNotification.php"
	dataForServer = {
		"sender": notification.sender,
		"receiver": notification.receiver,
		"date": notification.date
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
			deleteNotificationFromDB({ sender: notification.sender, receiver: notification.receiver, date: notification.date});
		} else {
			console.log("sin éxito al guardar contactos");
			console.log("returnedData: " + returnedData);
		}	 
	}, 'json')
	.fail(function() {
		console.log("server connection failed while saving contacts");
	});	
}

function refreshPage() {
	localStorage.removeItem("notifications");
	setTimeout(function() {
		window.location.replace("notifications.html");
	}, 500);
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
			localStorage.setItem("userFound", notification.sender);
			setTimeout(function() {
				window.location.replace("people.html");
			}, 500);
		});
		$("#deleteMessage").click(function() {
			console.log("eliminando notificación de la base de datos");
			deleteNotificationFromDB(notification);
			refreshPage();
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
			refreshPage();
		});	
	} else if (notification.type == "invitation") {
		console.log("manejo de eventos sin implementar");
		var eventInfo = JSON.parse(notification.message_content)[0];
		var startDate = eventInfo.start.substring(0, 10) + " " + eventInfo.start.substring(11, 19);
		var finishDate = eventInfo.finish.substring(0, 10) + " " + eventInfo.finish.substring(11, 19);
		console.log("eventInfo: " + JSON.stringify(eventInfo));
		$("#eventName").empty();
		$("#eventCreator").empty();
		$("#eventStart").empty();
		$("#eventFinish").empty();

		$("#eventName").append("<strong>Título: </strong>" + eventInfo.name);
		$("#eventCreator").append("<strong>Creador: </strong>" + eventInfo.creator);
		$("#eventStart").append("<strong>Inicio: </strong>" + startDate);
		$("#eventFinish").append("<strong>Fin: </strong>" + finishDate);
		$("#eventViewer").popup();
		$("#eventViewer").popup("open");

		$("#acceptEvent").click(function() {
			console.log("aceptando evento...");
		});
		$("#rejectEvent").click(function() {
			deleteNotificationFromDB(notification);
			refreshPage();
		});
	}
};

$(document).ready(function() {
	// Si hay notificaciones...
	console.log("lo que hay en localStorage.notifications: " + localStorage.notifications);
	if (localStorage.notifications) {
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
				var eventInfo = JSON.parse(val.message_content);
				console.log("eventInfo: " + JSON.stringify(eventInfo));
				var newEventButton = $('<a id="not' + i + '"data-icon="carat-r" class="ui-btn ui-btn-b ui-icon-carat-r ui-btn-icon-left">' + 
					eventInfo[0].creator + ': <i>' + eventInfo[0].name + '</i></a>');

				if (val.is_read > 0) {
					$("#eventsContainer").append(newEventButton);
				} else {
					$("#eventsContainer").prepend(newEventButton);
					$("#not" + i).css("background-color", "green");
					$("#eventsCollapsible").css("background-color", "green");
				}
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
	}
});