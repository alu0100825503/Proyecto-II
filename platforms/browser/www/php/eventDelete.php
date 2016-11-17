<?php
$server = "mysql.hostinger.es";
$user = "u344358176_calen";
$pass = "supercalendar";
$bd = "u344358176_calen";

$event = json_decode($_POST['eventData']);
$id = $event[0]->id;

//Creamos la conexión
$conexion = mysqli_connect($server, $user, $pass,$bd) 
or die("Ha sucedido un error inexperado en la conexion de la base de datos");

//generamos la consulta
$sql = "DELETE FROM Event WHERE id='$id'";
mysqli_set_charset($conexion, "utf8"); //formato de datos utf8

if(!$result = mysqli_query($conexion, $sql)) die();

//desconectamos la base de datos
$close = mysqli_close($conexion) 
or die("Ha sucedido un error inexperado en la desconexion de la base de datos");
?>