$(document).ready(function() {
  $("#form").on('submit',function () {
    var formData = new FormData();
    formData.append('file',$('#filesel')[0].files[0] )
    console.log(formData);
    $.ajax({url:"http://socialcalendarplus.esy.es/filesetter.php",
    type: "POST",
    data: formData,
    contentType: false,
    cache: false,
    processData:false,
    success: function(data){
      console.log("entro");
      console.log(data.success);
    },
    error: function(error){
      console.log("ha fallado" + error);
    }});

    //https://www.html5rocks.com/es/tutorials/file/dndfiles/
    //https://abandon.ie/notebook/simple-file-uploads-using-jquery-ajax
    //http://casamadrugada.net/tutoriales/php/como-almacenar-archivos-imagenes-en-mysql-utilizando-php/
    //https://www.formget.com/ajax-image-upload-php/
    //http://www.aorank.com/tutorial/Live_demo_ajax_upload_image/ajax_upload_image_main.php
    //https://manuais.iessanclemente.net/index.php/Almacenamiento_de_im%C3%A1genes_en_bases_de_datos_con_PHP#Formulario_para_subir_im.C3.A1genes
    //http://www.forosdelweb.com/f18/tutorial-ejemplo-subir-archivos-bd-guardando-bd-binario-127775/


  });
});
