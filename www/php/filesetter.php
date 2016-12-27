<?php

header('content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
$jsondata = array();

if(count($_FILES) > 0) {
  if(is_uploaded_file($_FILES['file']['tmp_name'])) {
    $dbserver = "mysql.hostinger.es";
    $dbuser = "u344358176_calen";
    $password = "supercalendar";
    $dbname = "u344358176_calen";
    $database = new mysqli($dbserver, $dbuser, $password, $dbname);
    if($database->connect_errno) {
      die("No se pudo conectar a la base de datos");
    }
    $imgData =addslashes(file_get_contents($_FILES['file']['tmp_name']));
    $imageProperties = getimageSize($_FILES['file']['tmp_name']);

    if ( $database->query( "INSERT INTO Files (name, size, data)
    VALUES('$_FILES['file']['tmp_name']', '$imageProperties', '$imgData')") ){
      $jsondata["success"] = true;
      $jsondata["data"] = array('message' => "Actualización correcta '$data'" );
    } else {
      die ("error en la sentencia sql");
      $jsondata["success"] = false;
      $jsondata["data"] = array('message' => $database->error);
    }
  }
}


  //header('Content-type: application/json; charset=utf-8');
  //echo json_encode($jsondata, JSON_FORCE_OBJECT);
  header();
  echo "todo ok";
  $database->close();
}
exit();

?>
