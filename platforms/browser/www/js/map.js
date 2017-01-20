document.addEventListener("deviceready", onDeviceReadyTwo, false);
var map = undefined;
var existMap = false;
var userposNav;
var eventposNav;
var evLat;
var evLng;
var latitude = undefined;
var longitude = undefined;
var accuracy;
var circle = undefined;
var directionsDisplay;
var directionsService;
var ub;
function onDeviceReadyTwo() {

  function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
    });
    return vars;
  }

  evLat = parseFloat(getUrlVars()["lat"])
  evLng = parseFloat(getUrlVars()["lng"])


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
    latitude = 28.482761;
    longitude = -16.322151;
    accuracy = 100;
    if (!existMap){
      initMap(latitude, longitude, accuracy);
      existMap = true;
    } else {
      updateMap(latitude,longitude);
    }
  }
  navigator.geolocation.watchPosition(onSuccess, onError,{enableHighAccuracy: true});
  location.reload();
}

function openNav(){
  ub = JSON.parse($('#coordsEdit').val());
  $('#popupAddEvent').popup("close");
  timeoutID = window.setTimeout(navOpen, 900);
}


function navOpen(){
  chargePage("map.html?lat="+ub.lat+"&lng="+ub.lng+"");
  window.clearTimeout(timeoutID);
}

function initMap(latitude, longitude, accuracy) {
  userposNav = new google.maps.LatLng(latitude, longitude);
  eventposNav = new google.maps.LatLng(evLat, evLng);
  var latLong = new google.maps.LatLng(latitude, longitude);
  map = new google.maps.Map(document.getElementById('map'), {
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

  userposNav = new google.maps.Marker({
    position: latLong,
    icon: {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 8,
      rotation: 0.
    },
    map: map,
    title: 'Mi posición'
  });
  eventposNav = new google.maps.Marker({
    position: eventposNav,
    map: map,
    title: 'Evento'
  });

  existMap = true;
}
function updateMap(latitude, longitude) {
  var latLong = new google.maps.LatLng(latitude, longitude);
  map.setCenter(latLong);
  userposNav.setPosition(latLong);
  circle.setCenter(latLong);
  circle.setRadius(parseFloat(accuracy));
  navigator.compass.getCurrentHeading(function (heading){
    var rot = parseFloat(heading.magneticHeading);
    userposNav.setOptions({icon: {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 8,
      rotation: rot
    }});
  }, function (error){
    alert("Error:" + error)
  });
  maproute (userposNav, eventposNav);
}

function maproute(orig, dest){
  directionsService = new google.maps.DirectionsService();
  var request = {
    origin: userposNav.getPosition(),
    destination: eventposNav.getPosition(),
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
