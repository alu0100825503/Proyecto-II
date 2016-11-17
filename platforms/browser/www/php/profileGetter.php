<?php
header('content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
if(isset($_POST['par'])) {
  $params = json_decode($_POST['par'], true);
  get_persons($params['id']);
} else {
  die("Solicitud no válida.");
}

function get_persons( $id ) {

  //Datos de conexión a la base de datos
  $dbserver = "mysql.hostinger.es";
  $dbuser = "u344358176_calen";
  $password = "supercalendar";
  $dbname = "u344358176_calen";

  $database = new mysqli($dbserver, $dbuser, $password, $dbname);

  if($database->connect_errno) {
    die("No se pudo conectar a la base de datos");
  }

  $jsondata = array();

  //Sanitize ipnut y preparar query
//  if( is_array($id) ) {
//    $id = array_map('intval', $id);
//    $querywhere = "WHERE `ID` IN (" . implode( ',', $id ) . ")";
//  } else {
//    $id = intval($id);
//    $querywhere = "WHERE `ID` = " . $id;
//  }

  if ( $result = $database->query( "SELECT * FROM User WHERE username = '$id'") ){

  if( $result->num_rows > 0 ) {
    $jsondata["success"] = true;
    foreach ($result as $row) {
        $jsondata["user"] = $row['username'];
        $jsondata["name"] = $row['name'];
        $jsondata["lastname"] = $row['lastname'];
        $jsondata["email"]=$row['email'];
        $jsondata["tel"]=$row['telephone'];
    }
   } else {
     $jsondata["success"] = false;
     $jsondata["data"] = array('message' => "No se ha obtenido resultados");
   }
   $result->close();
  } else {
    $jsondata["success"] = false;
    $jsondata["data"] = array('message' => $database->error);
  }
  header('Content-type: application/json; charset=utf-8');
  echo json_encode($jsondata, JSON_FORCE_OBJECT);

  //if(isset($_POST['callback'])){ // Si es una petición cross-domain
  //  echo $_POST['callback'].'('.json_encode($jsondata, JSON_FORCE_OBJECT).')';
  //}
  //else // Si es una normal, respondemos de forma normal
  //  echo json_encode($jsondata, JSON_FORCE_OBJECT);


  $database->close();
}
exit();
?>
