function makePostRequest(dataForServer) {
	url = "http://socialcalendarplus.esy.es/login.php";
	//url = "http://localhost/login.php";

	var ajaxRequest = $.post(url, dataForServer, function(returnedData) {
			console.log(returnedData);
			// Guardar el nombre de usuario para el resto de páginas
			localStorage.setItem("username", dataForServer.username);
			
			if (returnedData.success) {
				// Store login data for a valid user if remember me is checked
				if ($('#rememberme').is(":checked")) {
					if (window.localStorage) {
						console.log("Web browser supports LocalStorage");
						localStorage.setItem("lastUsername", $("#usernamelogin").val());
						localStorage.setItem("lastPassword", $("#passwordlogin").val());
					}
				} 
				else {
					// Delete login data if remember me is unchecked
					localStorage.removeItem("username");
					localStorage.removeItem("password");
				}
				window.location = "calendar.html";
			}
			else {
				console.log("login failed");
				// Show warning popup:
				$("#popupLogin").popup("close");
				setTimeout(function() {
					$("#warningLogin").popup();
					console.log("showing warning...");
					$("#warningLogin").popup("open");
				}, 500);
			}
		}, 'json')
		.fail(function() {
			console.log("server connection failed");
		});
}

$(document).ready(function() {
	// If the browser supports localStorage and we have some stored data
	if (window.localStorage && localStorage.username) {
		console.log("stored user: " + localStorage.username);
		$("#usernamelogin").val(localStorage.lastUsername);
		$("#passwordlogin").val(localStorage.lastPassword);
		// TODO: hacer inicio de sesión automático si hay datos 
		// guardados en localStorage
		//makePostRequest(datosguardados)...
	}

	$("#submitlogin").click(function(evt) {
		evt.preventDefault();
		formData = {
			"username": $("#usernamelogin").val(),
			"password": $("#passwordlogin").val()
		}
		makePostRequest(formData);
	});
});