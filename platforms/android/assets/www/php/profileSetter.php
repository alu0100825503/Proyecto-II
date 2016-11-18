<?php
header('content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
if(isset($_POST['par'])) {
  $arguments = json_decode($_POST['par'], true);
  set_data($arguments);
} else {
  die("Solicitud no válida.");
}
function set_data( $data ) {
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
  $username = $data["username"];
  $newusername = $data["newusername"];
  $name = $data["name"];
  $lastname = $data["lastname"];
  $email = $data["email"];
  $telephone = $data["telephone"];
  if ( $database->query( "UPDATE User SET username = '$newusername', name = '$name', lastname = '$lastname', email = '$email', telephone = '$telephone'  WHERE username = '$username'") ){
    $jsondata["success"] = true;
    $jsondata["data"] = array('message' => "Actualización correcta '$data'" );
  } else {
    $jsondata["success"] = false;
    $jsondata["data"] = array('message' => $database->error);
  }
  header('Content-type: application/json; charset=utf-8');
  echo json_encode($jsondata, JSON_FORCE_OBJECT);
  $database->close();
}
exit();
?>
