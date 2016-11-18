$(document).ready(function() {
	//url = "http://socialcalendarplus.esy.es/login.php";
	url = "http://localhost/login.php";

	$("#submitlogin").click(function(evt) {
		evt.preventDefault();
		formData = {
			"username": $("#usernamelogin").val(),
			"password": $("#passwordlogin").val()
		}

		console.log("post");
		var ajaxRequest = $.post(url, formData, function(returnedData) {
			console.log(returnedData);	
		}, 'json')
		.fail(function() {
			console.log("error en la respuesta del servidor");
		});
	});
});