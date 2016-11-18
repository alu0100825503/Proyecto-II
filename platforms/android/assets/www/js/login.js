$(document).ready(function() {
	//url = "http://socialcalendarplus.esy.es/login.php";
	url = "http://localhost/login.php";

	$("#submitlogin").click(function(evt) {
		evt.preventDefault();
		formData = {
			"username": $("#usernamelogin").val(),
			"password": $("#passwordlogin").val()
		}

		//console.log(formData);
		var ajaxRequest = $.post(url, formData, function(returnedData) {
			console.log(returnedData);
			if (returnedData.success) {
				window.location = "profile.html";
			}
			else {
				// Show a warning popup
				console.log("failed");
				$("#popupLogin").popup("close");
				$("#popupDialogLogin").popup("open");
			}
		}, 'json')
		.fail(function() {
			console.log("error en la respuesta del servidor");
		});
	});
});