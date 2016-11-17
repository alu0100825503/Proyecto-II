$(document).ready(function() {
	$("#registerForm").on('submit', function(evt) {
		evt.preventDefault();
		var username = $("#newusername").val();
		var password = $("#password").val();
		var rptpassword = $("#pwrepeat").val();
		var realname = $("#userrealname").val();
		var lastname = $("#userlastname").val();
		var birth = $("#date").val();
		var errors = "";
		
		console.log("realname: " + realname);
		console.log("lastname: " + lastname);
		
		// Las contraseñas introducidas deben ser iguales
		if (password !== "" && rptpassword !== "") {
			if (password !== rptpassword) {
				errors += "- Las contraseñas no coinciden.\n";
			}	
		} else {
			errors += "- Debe indicar una contraseña.\n";
		}
		
		// El nombre y apellidos del usuario deben estar formados únicamente letras
		if (!realname.match(/^[a-zA-Z]+$/) || !realname.match(/^[a-zA-Z]+$/)) {
			errors += " - El nombre y apellidos deben estar compuestos únicamente por caracteres alfabéticos.\n";
		}
		
		// La fecha de nacimiento debe ser una fecha válida
		if (birth == "") {
			errors += "- Debe indicar una fecha.\n";
		}
		
		// Mostrar los posibles errores
		if (errors.length != 0) {
			alert("Se detectaron errores en el formulario de registro: \n" + errors);
		} else {
			// TODO Enviar formulario
		}
	});
});