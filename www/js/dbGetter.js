$(document).ready(function() {
  $('input[name=photo]').on('change', function () {
    var formData = new FormData();
    var formData2 = new FormData();
    formData.append('archivo',document.getElementById("photo").files[0] );
    $.ajax({url:"http://socialcalendarplus.esy.es/filephp.php",
    type: "POST",
    data: formData,
    contentType: false,
    cache: false,
    processData:false,
    success: function(data){
      console.log("entro");
      console.log(data);
      formData.append('id', data);
    },
    error: function(error){
      console.log("ha fallado" + error);
    }});

    $.ajax({url:"http://socialcalendarplus.esy.es/imageGetter.php",
    type: "POST",
    data: formData2,
    contentType: false,
    cache: false,
    processData:false,
    success: function(data){
      console.log("entro");
      console.log(data);
    },
    error: function(error){
      console.log("ha fallado" + error);
    }});



  });


  //https://www.html5rocks.com/es/tutorials/file/dndfiles/
  //https://abandon.ie/notebook/simple-file-uploads-using-jquery-ajax
  //http://casamadrugada.net/tutoriales/php/como-almacenar-archivos-imagenes-en-mysql-utilizando-php/
  //https://www.formget.com/ajax-image-upload-php/
  //http://www.aorank.com/tutorial/Live_demo_ajax_upload_image/ajax_upload_image_main.php
  //https://manuais.iessanclemente.net/index.php/Almacenamiento_de_im%C3%A1genes_en_bases_de_datos_con_PHP#Formulario_para_subir_im.C3.A1genes
  //http://www.forosdelweb.com/f18/tutorial-ejemplo-subir-archivos-bd-guardando-bd-binario-127775/


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
  $("#send").click(function (){
    var myObject3 = new Object();
    myObject3.username = "Pepe_85";
    myObject3.name = $('input[name=name]').val();
    myObject3.lastname = $('input[name=apellido]').val();
    myObject3.email = $('input[name=correoe]').val();
    myObject3.telephone = $('input[name=telefono]').val();
    myObject3.newusername = "Pepe_85";
    var json3 = JSON.stringify(myObject3);
    console.log(json3);
    $.post("http://socialcalendarplus.esy.es/profileSetter.php",{ par:json3},null, "json")
    .done(function( data, textStatus, jqXHR ) {
      if ( data.success ) {
      } else {
        console.log("Error: " + data);
      }
    })
    .fail(function( jqXHR, textStatus, errorThrown ) {
      if ( console && console.log ) {
        console.log( "La solicitud ha fallado: " +  textStatus);
      }
    });
  });
  $("#discard").click(function (){
    var myObject2 = {id : 'Pepe_85'}
    var json2 = JSON.stringify(myObject2);
    $.post("http://socialcalendarplus.esy.es/profileGetter.php",{ par:json2},null, "json")
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
});
