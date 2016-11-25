var timeoutID;
var eventposMark;
var eventpos;
var userpos;
var devReady = false;
//$('#pos').change(convertDirection);
function getPositionOnMap(){
  $('#popupAddEvent').popup("close");
  timeoutID = window.setTimeout(mapOpen, 900);
}
function onDeviceReady () {
  navigator.geolocation.getCurrentPosition(
    function (position){
      userpos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    },
    function (error){
      alert ("Error leyendo su posición")
    });
  }
  function mapOpen(){
    $('#locationMap').popup("open");
    document.addEventListener("deviceready", onDeviceReady, false);
    map = new google.maps.Map(document.getElementById('map'), {
      center: userpos,
      zoom: 18
    });
    eventposMark = new google.maps.Marker({
      position: userpos,
      map: map,
      draggable: true,
      title: 'Hello World!'
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
      alert (eventpos.toJSON().lat);
      $('#coords').val(eventpos.toJSON());
      $('#locationMap').popup("close");
      timeoutID = window.setTimeout(addEventOpen, 900);
    }

    function convertDirection (){
      geocoder.geocode({'address': $('#pos')}.val(), function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          $('#coords').val(results[0].toJSON());

        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }



    function addEventOpen(){
      $('#popupAddEvent').popup("open");
    }
