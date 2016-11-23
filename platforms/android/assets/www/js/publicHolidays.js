$(document).ready(function() {
	// Get the JSON with all public holidays in Spain
	var country = "spain";
	var apiKey = "AIzaSyCzOnZPKf2UmQD8rBm3fNd0SzMfG7p4DdU";
	var calendarUrl = 'https://www.googleapis.com/calendar/v3/calendars/en.' + country 
		+ '%23holiday%40group.v.calendar.google.com/events?key=' + apiKey;

	console.log("publicHolidays");

	$.getJSON(calendarUrl)
    .success(function(data) {
			// paint public holidays on calendar
    	console.log(new Date(data.items[0].start.date));
    })
    .error(function(error) {
      console.log("fail while getting the json from the server");
    })
});