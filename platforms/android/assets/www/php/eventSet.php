<?php
$server = "mysql.hostinger.es";
$user = "u344358176_calen";
$pass = "supercalendar";
$bd = "u344358176_calen";

$event = json_decode($_POST['eventData']);
$name = $event[0]->name;
$start = $event[0]->start;
$finish = $event[0]->finish;
$private = $event[0]->private;

//Creamos la conexión
$conexion = mysqli_connect($server, $user, $pass,$bd) 
or die("Ha sucedido un error inexperado en la conexion de la base de datos");

//generamos la consulta
$sql = "INSERT INTO Event (name, start, finish, creator, private)
VALUES('$name', '$start', '$finish', 'test', '$private')";
mysqli_set_charset($conexion, "utf8"); //formato de datos utf8

if(!$result = mysqli_query($conexion, $sql)) die();

//desconectamos la base de datos
$close = mysqli_close($conexion) 
or die("Ha sucedido un error inexperado en la desconexion de la base de datos");
?>