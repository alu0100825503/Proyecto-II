$(document).ready(function() {
	//url = "http://socialcalendarplus.esy.es/login.php";
	url = "http://localhost/login.php";

	console.log(window.localStorage);

	// If the browser supports localStorage and we have some stored data
	if (window.localStorage && localStorage.username) {
		console.log("stored user: " + localStorage.username);
		$("#usernamelogin").val(localStorage.username);
		$("#passwordlogin").val(localStorage.password);	
	}

	$("#submitlogin").click(function(evt) {
		evt.preventDefault();
		formData = {
			"username": $("#usernamelogin").val(),
			"password": $("#passwordlogin").val()
		}

		//console.log(formData);
		var ajaxRequest = $.post(url, formData, function(returnedData) {
			if (returnedData.success) {
				// Store login data for a valid user
				if ($('#rememberme').is(":checked")) {
					if (window.localStorage) {
						console.log("Web browser supports LocalStorage");
						localStorage.setItem("username", $("#usernamelogin").val());
						localStorage.password = $("#passwordlogin").val();
					}
				};
				window.location = "profile.html";
			}
			else {
				console.log("login failed");
				// Show warning popup:
				$("#popupDialogLogin").popup("open");
			}
		}, 'json')
		.fail(function() {
			console.log("server connection failed");
		});
	});
});