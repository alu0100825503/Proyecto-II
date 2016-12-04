$(document).ready(function() {
	console.log("profile.js");
	$("#usernameTitle").text(localStorage.getItem("username"));
});