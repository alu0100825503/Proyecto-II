<?php
$server = "mysql.hostinger.es";
$user = "u344358176_calen";
$pass = "supercalendar";
$bd = "u344358176_calen";

$contacts = json_decode($_POST['eventData']);
$user1 = $contacts[0]->user1;
$user2 = $contacts[0]->user2;

//Creamos la conexión
$conexion = mysqli_connect($server, $user, $pass,$bd) 
or die("Ha sucedido un error inexperado en la conexion de la base de datos");

//generamos la consulta
$sql = "SELECT * FROM Contacts WHERE (user1 LIKE '$user1' AND user2 LIKE '$user2') OR (user1 LIKE '$user2' AND user2 LIKE '$user1')";
mysqli_set_charset($conexion, "utf8"); //formato de datos utf8

if(!$result = mysqli_query($conexion, $sql)) die();

$numRows = $result->num_rows;

//desconectamos la base de datos
$close = mysqli_close($conexion) 
or die("Ha sucedido un error inexperado en la desconexion de la base de datos");

$json_string = json_encode($numRows);
echo $json_string;
?>