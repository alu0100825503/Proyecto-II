$(document).ready(function() {
	//url = "http://socialcalendarplus.esy.es/login.php";
	url = "http://localhost/login.php";

	$("#submitlogin").click(function(evt) {
		evt.preventDefault();
		formData = {
			"username": $("#usernamelogin").val(),
			"password": $("#passwordlogin").val()
		}
		
		$.post(url, { eventData: formData }, function(data) {
			alert(data);	
		},
		'json');
	});
});