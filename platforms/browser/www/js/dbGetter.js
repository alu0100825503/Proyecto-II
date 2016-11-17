$(document).ready(function() {
  var myObject = {id : 'JuanitoIto'}
  var json = JSON.stringify(myObject);
  $.post("http://socialcalendarplus.esy.es/profileGetter.php",{ par:json},null, "json")
  .done(function( data, textStatus, jqXHR ) {
        if ( data.success ) {
            $('input[name=name]').val(data.name);
            $('input[name=apellido]').val(data.lastname);
            $('input[name=telefono]').val(data.tel);
            $('input[name=correoe]').val(data.email);
        } else {
          console.log("Error: " + data.message);
        }
  })
  .fail(function( jqXHR, textStatus, errorThrown ) {
    if ( console && console.log ) {
            console.log( "La solicitud a fallado: " +  textStatus);
        }
});
});
