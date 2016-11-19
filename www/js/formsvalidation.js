$(document).ready(function() {
	$("#registerForm").on('submit', function(evt) {
		evt.preventDefault();
		var re_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var username = $("#newusername").val();
		var password = $("#password").val();
		var rptpassword = $("#pwrepeat").val();
		var realname = $("#userrealname").val();
		var lastname = $("#userlastname").val();
		var birth = $("#date").val();
		var email = $("#email").val();
		var tel = $("#telephone").val();
		var error = false;
		
		console.log("realname: " + realname);
		console.log("lastname: " + lastname);
		
		// Las contraseñas introducidas deben ser iguales
		if (password !== "" && rptpassword !== "") {
			if (password !== rptpassword) {
				error = true;
				// Set textboxes red
				$("#password").parent().css('border-color', 'red');
				$("#pwrepeat").parent().css('border-color', 'red');
			}	
		} else {
			error = true;
			$("#password").parent().css('border-color', 'red');
			$("#pwrepeat").parent().css('border-color', 'red');
		}

		// El nombre y apellidos del usuario deben estar formados únicamente letras
		if (!realname.match(/^[a-zA-Z]+$/) || !lastname.match(/^[a-zA-Z]+$/)) {
			error = true;
			$("#userrealname").parent().css('border-color', 'red');
			$("#userlastname").parent().css('border-color', 'red');
		}
		
		// La fecha de nacimiento debe ser una fecha válida
		if (birth == "") {
			error = true;
			$("#date").parent().css('border-color', 'red');
		}
		
 		// El email debe tener el formato correcto, dada por la re
		if (!re_email.test(email)) {
			alert("error en email");
		}

		// El télefono debe estar compuesto por 9 caracteres numéricos
		if (!tel.match(/^[\d]{9}/)) {
			error = true;
			alert("error en tel");
		}

		// Mostrar los posibles errores
		if (error) {
			alert("Hubo errores en el formulario. Por favor, revíselo y envíelo de nuevo.");
		} else {
			//url = "http://socialcalendarplus.esy.es/register.php";
			url = "http://localhost/register.php"; 
			formData = {
				"username": username,
				"password": password,
				"name": realname,
				"lastname": lastname,
				"birth": birth,
				"email": email,
				"tel": tel
			};

			var ajaxRequest = $.post(url, formData, function(returnedData) {
				console.log(returnedData);
				if (returnedData.success) {
					// éxito: llevar al usuario a profile.html por ejemplo
				} else {
					if (returnedData.userAlreadyExists) {
						console.log("user already exists in the db");
					}
					else if (returnedData.emailAlreadyExists) {
						console.log("email already exists in the db");
					}
					else {
						console.log("unknown error");
					}
				}
			}, 'json')
			.fail(function() {
				console.log("server connection failed");
			});
		}
	});
});