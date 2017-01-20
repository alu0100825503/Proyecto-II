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
		} else {
			console.log("sin éxito al guardar contactos");
			console.log("returnedData: " + returnedData);
		}
	}, 'json')
	.fail(function() {
		console.log("server connection failed while saving contacts");
	});
}

function acceptEvent(notification) {
	var setEventUrl = "http://socialcalendarplus.esy.es/eventSet.php";
	var eventInfo = JSON.parse(notification.message_content)[0];
	newEventData = [{
				"name": eventInfo.name,
				"start": new Date(eventInfo.start),
				"finish": new Date(eventInfo.finish),
				"creator": eventInfo.creator,
				"private": eventInfo.private
			}]
	var newEventDataStr = JSON.stringify(newEventData);

	// Crear el evento
	$.post(setEventUrl, { eventData: newEventDataStr }, function(returnedData) {
		console.log("evento supuestamente guardado en la BD...");
		console.log("returnedData in acceptEvent: " + returnedData);
	})
	.fail(function() {
		console.log("server connection failed");
	});

	// Añadir fila a invitation
	newInvitationData = {
			"user": notification.receiver,
			"eventName": eventInfo.name,
			"eventDate": new Date(eventInfo.start),
			"eventCreator": eventInfo.creator
		};

	var setInvitationUrl = "http://socialcalendarplus.esy.es/addInvitation.php";
	console.log("storing invitation...");
	$.post(setInvitationUrl, newInvitationData, function(returnedData) {
		if (returnedData.success) {
			console.log("invitation was created");
		} else {
			console.log("php failed");
			console.log(returnedData);
		}
	}, 'json')
	.fail(function() {
		console.log("server connection failed");
	});
}

function refreshPage() {
	localStorage.removeItem("notifications");
	setTimeout(function() {
		window.location.replace("notifications.html");
	}, 500);
}

function chargeLocationPage(lat, lng) {
	chargePage("map.html?lat=" + lat + "&lng=" + lng + "");
	window.setTimeout(3000);
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
			localStorage.setItem("userFound", notification.sender);
			setTimeout(function() {
				window.location.replace("people.html");
			}, 500);
		});
		$("#deleteMessage").click(function() {
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
			deleteNotificationFromDB(notification);
			// Show popup
			$("#contactViewer").popup("close");
			setTimeout(function() {
				$("#infoPopupTitle").text("Usuario aceptado");
				$("#infoPopupText").text("El usuario ha sido añadido correctamente a la lista de contactos.");
				$("#infoPopup").popup();
				$("#infoPopup").popup("open");
				$("#infoOK").click(function() {
					refreshPage();
				});
			}, 500);
		});
		$("#rejectContact").click(function() {
			deleteNotificationFromDB(notification);
			$("#contactViewer").popup("close");
			setTimeout(function() {
				$("#infoPopupTitle").text("Solicitud rechazada");
				$("#infoPopupText").text("Se ha denegado la solicitud de contacto.");
				$("#infoPopup").popup();
				$("#infoPopup").popup("open");
				$("#infoOK").click(function() {
					refreshPage();
				});
			}, 500);
		});
	} else if (notification.type == "invitation") {
		var eventInfo = JSON.parse(notification.message_content)[0];
		var startDate = eventInfo.start.substring(0, 10) + " " + eventInfo.start.substring(11, 19);
		var finishDate = eventInfo.finish.substring(0, 10) + " " + eventInfo.finish.substring(11, 19);

		$("#eventName").empty();
		$("#eventCreator").empty();
		$("#eventStart").empty();
		$("#eventFinish").empty();
		$("#eventLocation").empty();

		$("#eventName").append("<strong>Título: </strong>" + eventInfo.name);
		$("#eventCreator").append("<strong>Creador: </strong>" + eventInfo.creator);
		$("#eventStart").append("<strong>Inicio: </strong>" + startDate);
		$("#eventFinish").append("<strong>Fin: </strong>" + finishDate);

		// Si hay ubicación
		if (eventInfo.hasOwnProperty("location")) {
			var eventLocation = {
				"lat": eventInfo.location.lat,
				"lng": eventInfo.location.lng
			};

			// Crear botón de acceso a localización
			var accessAnchor = $('<a/>',
			{
				text: 'Acceder',
				click: function () { chargePage("map.html?lat=" + eventLocation.lat + "&lng=" + eventLocation.lng); }
			});

			$("#eventLocation").append("<strong>Ubicación: </strong>" +
				eventLocation.lat + ", " +
				eventLocation.lng + ". ");

			// Añadir el botón
			accessAnchor.appendTo($("#eventLocation"));

		}

		$("#eventViewer").popup();
		$("#eventViewer").popup("open");

		$("#acceptEvent").click(function() {
			$("#eventViewer").popup("close");
			setTimeout(function() {
				acceptEvent(notification);
				//deleteNotificationFromDB(notification);
				$("#infoPopupTitle").text("Evento aceptado");
				$("#infoPopupText").text("Se ha añadido el evento a su calendario.");
				$("#infoPopup").popup();
				$("#infoPopup").popup("open");
				$("#infoOK").click(function() {
					refreshPage();
				});
			}, 500);

		});
		$("#rejectEvent").click(function() {
			deleteNotificationFromDB(notification);
			$("#eventViewer").popup("close");
			setTimeout(function() {
				$("#infoPopupTitle").text("Solicitud rechazada");
				$("#infoPopupText").text("Se ha denegado la solicitud de evento.");
				$("#infoPopup").popup();
				$("#infoPopup").popup("open");
				$("#infoOK").click(function() {
					refreshPage();
				});
			}, 500);
		});
	}
};

$(document).ready(function() {
	var url = "http://socialcalendarplus.esy.es/getNotifications.php";
	var receiver = localStorage.username;
	var dataForServer = { "receiver": receiver };

	$.post(url, dataForServer, function(returnedData) {
		if (returnedData.success) {
			notifications_obj = returnedData;
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

			var notifications = [];

			// Organizar las notificaciones en las categorías
			jQuery.each(notifications_obj.notifications, function(i, val) {
				var notificationColor = "#228B22";
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
						// Make collapsible and message green
						$("#messagesCollapsible").find(".ui-collapsible-heading-toggle").addClass("greenCollHeader");
						$("#messagesContainer").prepend(newMessageButton);
						$("#not" + i).css("background-color", notificationColor);
					}

				} else if (val.type == "invitation") {
					console.log("procesando: " + val.message_content);
					var eventInfo = JSON.parse(val.message_content);
					var newEventButton = $('<a id="not' + i + '"data-icon="carat-r" class="ui-btn ui-btn-b ui-icon-carat-r ui-btn-icon-left">' +
						eventInfo[0].creator + ': <i>' + eventInfo[0].name + '</i></a>');

					if (val.is_read > 0) {
						$("#eventsContainer").append(newEventButton);
					} else {
						$("#eventsCollapsible").find(".ui-collapsible-heading-toggle").addClass("greenCollHeader");
						$("#eventsContainer").prepend(newEventButton);
						$("#not" + i).css("background-color", notificationColor);
					}
				} else if (val.type == "friendship") {
					var newContactButton = $('<a id="not' + i + '"data-icon="carat-r" class="ui-btn ui-btn-b ui-icon-carat-r ui-btn-icon-left">' +
						val.sender + ": <i>" +
						val.message_subject +
						"</i></a>");

					if (val.is_read > 0) {
						$("#contactsContainer").append(newContactButton);
					} else {
						$("#contactsCollapsible").find(".ui-collapsible-heading-toggle").addClass("greenCollHeader");
						$("#contactsContainer").prepend(newContactButton);
						$("#not" + i).css("background-color", notificationColor);
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
		else {
			console.log("not success getting the json");
		}
	}, 'json')
	.fail(function() {
		console.log("server connection failed");
	});
});
