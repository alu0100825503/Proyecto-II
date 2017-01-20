var timeoutID;
var eventposMark;
var eventpos;
var userpos;
var devReady = false;
$('#pos').bind("propertychange change input", function (){ alert ("hello");});
function getPositionOnMap(){
  $('#popupAddEvent').popup("close");
  timeoutID = window.setTimeout(mapOpen, 900);
}
function onDeviceReady () {
  if ($('#coords').val()==""){
    userpos = new google.maps.LatLng({lat:28.482761, lng:-16.322151});
  }
  navigator.geolocation.getCurrentPosition(
    function (position){
      userpos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    },
    function (error){
      //{lat: -34, lng: 1
      alert ("Error leyendo su posición, posición por defecto")
    });
    //, { timeout: 5000 });
  }
  function mapOpen(){
    $('#locationMap').popup("open");
    if ($('#coords').val()==""){
      document.addEventListener("deviceready", onDeviceReady, false);
    } else {
      var ub = JSON.parse($('#coords').val());
      userpos = new google.maps.LatLng(ub.lat,ub.lng);
    }
    map = new google.maps.Map(document.getElementById('map'), {
      center: userpos,
      zoom: 18
    });
    eventposMark = new google.maps.Marker({
      position: userpos,
      map: map,
      draggable: true,
      title: 'Ubicación del evento'
    });
    window.clearTimeout(timeoutID);
  }
  function returnPosition(){
    eventpos = eventposMark.getPosition();
    var geocoder = new google.maps.Geocoder;
    var stpos;
    geocoder.geocode({location: eventpos},
      function (result, status){
        if (status === google.maps.GeocoderStatus.OK) {
          if (result[0]){
            $('#pos').val(result[0].formatted_address);
          } else {
            alert ("No ha habido resultados")
          }
        }
      },
      function (error){
        alert ("Error al convertir a texto")
      });
      $('#coords').val((JSON.stringify(eventpos)));
      $('#locationMap').popup("close");
      timeoutID = window.setTimeout(addEventOpen, 900);
    }

    function convertDirection (){
      var geocoder = new google.maps.Geocoder;
      geocoder.geocode({'address': $('#pos').val()}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          alert("Ubicación establecida en: " + results[0].formatted_address);
          $('#coords').val(JSON.stringify(results[0].geometry.location));
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }
    function addEventOpen(){
      $('#popupAddEvent').popup("open");
    }
