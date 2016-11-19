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
		var tel = $("#tel").val();
		var error = false;
		
		// Limpiar campos inicialmente
		$("#newusername").parent().css('border-color', 'green');
		$("#password").parent().css('border-color', 'green');
		$("#pwrepeat").parent().css('border-color', 'green');
		$("#userrealname").parent().css('border-color', 'green');
		$("#userlastname").parent().css('border-color', 'green');
		$("#date").parent().css('border-color', 'green');
		$("#email").parent().css('border-color', 'green');
		$("#tel").parent().css('border-color', 'green');
		$("#warningusername").text("");
		$("#warningpassword").text("");
		$("#warningname").text("");
		$("#warninglastname").text("");
		$("#warningdate").text("");
		$("#warningtel").text("");
		$("#warningtel").text("");

		if (username == "") {
			$("#newusername").parent().css('border-color', 'red');
			$("#warningusername").text("Debe indicar un nombre de usuario.");
			error = true;
		}

		// Las contraseñas introducidas deben ser iguales
		if (password !== "" && rptpassword !== "") {
			if (password !== rptpassword) {
				// Set textboxes red
				$("#password").parent().css('border-color', 'red');
				$("#pwrepeat").parent().css('border-color', 'red');
				$("#warningpassword").text("Las contraseñas no coinciden.");
				error = true;
			}	
		} else {
			$("#password").parent().css('border-color', 'red');
			$("#pwrepeat").parent().css('border-color', 'red');
			$("#warningpassword").text("Rellene ambos campos de contraseña.");
			error = true;
		}

		// El nombre debe estar compuesto únicamente por caracteres alfabéticos
		if (!realname.match(/^[a-zA-Z]+$/)) {
			$("#userrealname").parent().css('border-color', 'red');
			$("#warningname").text("El nombre sólo puede contener letras");
			error = true;
		} 
		
		// El apellido debe estar compuesto únicamente por caracteres alfabéticos
		if (!lastname.match(/^[a-zA-Z]+$/)) {
			$("#userlastname").parent().css('border-color', 'red');
			$("#warninglastname").text("Los apellidos sólo pueden contener letras.");
			error = true;
		}
		
		// La fecha de nacimiento debe ser una fecha válida
		if (birth == "") {
			$("#date").parent().css('border-color', 'red');
			$("#warningdate").text("Debe indicar un fecha de nacimiento.");
			error = true;
		}
		
 		// El email debe tener el formato correcto, dada por la re
		if (!re_email.test(email)) {
			$("#email").parent().css('border-color', 'red');
			$("#warningemail").text("Formato de correo no válido.");
			error = true;
		}

		// El télefono debe estar compuesto por 9 caracteres numéricos
		if (!tel.match(/^[\d]{9}/)) {
			$("#tel").parent().css('border-color', 'red');
			$("#warningtel").text("El número de teléfono no es correcto.");
			error = true;
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
					// popup informando del éxito en el registro
					// guardar en el objeto de sesión al usuario
				} else {
					if (returnedData.userAlreadyExists) {
						console.log("user already exists in the db");
						$("#newusername").parent().css('border-color', 'red');
						$("#warningusername").text("El nombre de usuario ya existe.");
					}
					else if (returnedData.emailAlreadyExists) {
						console.log("email already exists in the db");
						$("#email").parent().css('border-color', 'red');
						$("#warningemail").text("El nombre de usuario ya existe.");
					}
					else {
						console.log("unknown error");
						alert("Ooooops! Error inesperado. Inténtelo de nuevo.");
					}
				}
			}, 'json')
			.fail(function() {
				console.log("server connection failed");
			});
		}
	});
});