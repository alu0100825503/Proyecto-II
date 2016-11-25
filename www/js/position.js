var timeoutID;
var eventposMark;
var eventpos;
function getPositionOnMap(){
  $('#popupAddEvent').popup("close");
  timeoutID = window.setTimeout(mapOpen, 900);
}
function mapOpen(){
  $('#locationMap').popup("open");
  var latLong = new google.maps.LatLng(28.5, -16.2);
  map = new google.maps.Map(document.getElementById('map'), {
    center: latLong,
    zoom: 18
  });
    eventposMark = new google.maps.Marker({
    position: {lat: 28.5, lng: -16.2},
    map: map,
    draggable: true,
    title: 'Hello World!'
  });
  window.clearTimeout(timeoutID);
}
function returnPosition(){
  eventpos = eventposMark.getPosition();
  $('#pos').val(eventpos.toString());
  $('#locationMap').popup("close");
  timeoutID = window.setTimeout(addEventOpen, 900);
}
function addEventOpen(){
    $('#popupAddEvent').popup("open");
}
