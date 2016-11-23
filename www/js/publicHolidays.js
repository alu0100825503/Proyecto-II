$(document).ready(function() {
	// Get the JSON with all public holdays in Spain
	var country = "spain";
	var apiKey = "AIzaSyCzOnZPKf2UmQD8rBm3fNd0SzMfG7p4DdU";
	var calendarUrl = 'https://www.googleapis.com/calendar/v3/calendars/en.' + country 
		+ '%23holiday%40group.v.calendar.google.com/events?key=' + apiKey;

	$.getJSON(calendarUrl)
    .success(function(data) {
    	console.log(data);
    })
    .error(function(error) {
      console.log("fail while getting the json from the server");
    })
});