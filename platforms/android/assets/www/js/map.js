document.addEventListener("deviceready", onDeviceReady, false);
var map = undefined;
var existMap = false;
var userpos;
var eventpos;
var latitude = undefined;
var longitude = undefined;
var accuracy;
var circle = undefined;
var directionsDisplay;
var directionsService;
function onDeviceReady() {
  var onSuccess = function(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    accuracy = position.coords.accuracy;
    if (!existMap){
      initMap(latitude, longitude, accuracy);
      existMap = true;
    } else {
      updateMap(latitude,longitude);
    }
  };
  function onError(error) {
    alert('code: '    + error.code    + '\n' +
    'message: ' + error.message + '\n');
  }
  navigator.geolocation.watchPosition(onSuccess, onError,{enableHighAccuracy: true});
}
function initMap(latitude, longitude, accuracy) {
  userpos = new google.maps.LatLng(latitude, longitude);
  eventpos = new google.maps.LatLng(28.5, -16.2);
  var latLong = new google.maps.LatLng(latitude, longitude);
  map = new google.maps.Map(document.getElementById('navMap'), {
    center: latLong,
    zoom: 18
  });

  circle = new google.maps.Circle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: map,
    center: latLong,
    radius: parseFloat(accuracy)
  });

  userpos = new google.maps.Marker({
    position: latLong,
    icon: {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 8,
      rotation: 0.
    },
    map: map,
    title: 'Mi posición'
  });
  eventpos = new google.maps.Marker({
    position: {lat: 28.5, lng: -16.2},
    map: map,
    title: 'Evento'
  });

  existMap = true;
}
function updateMap(latitude, longitude) {
  var latLong = new google.maps.LatLng(latitude, longitude);
  map.setCenter(latLong);
  userpos.setPosition(latLong);
  circle.setCenter(latLong);
  circle.setRadius(parseFloat(accuracy));
  navigator.compass.getCurrentHeading(function (heading){
    var rot = parseFloat(heading.magneticHeading);
    userpos.setOptions({icon: {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 8,
      rotation: rot
    }});
  }, function (error){
    alert("Error:" + error)
  });
  maproute (userpos, eventpos);
}

function maproute(orig, dest){
  directionsService = new google.maps.DirectionsService();
  var request = {
    origin: userpos.getPosition(),
    destination: eventpos.getPosition(),
    travelMode: google.maps.DirectionsTravelMode.DRIVING,
    unitSystem: google.maps.DirectionsUnitSystem.METRIC,
    provideRouteAlternatives: false
  };
  directionsService.route(request, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      if(directionsDisplay != null) {
        directionsDisplay.setMap(null);
        directionsDisplay = null;
      }
      directionsDisplay = new google.maps.DirectionsRenderer();
      directionsDisplay.setOptions({preserveViewport: true, markerOptions:{visible: false}});
      directionsDisplay.setMap(map);
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
