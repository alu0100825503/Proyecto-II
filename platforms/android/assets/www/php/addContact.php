<?php
$server = "mysql.hostinger.es";
$user = "u344358176_calen";
$pass = "supercalendar";
$bd = "u344358176_calen";

$contact = json_decode($_POST['eventData']);
$sender = $contact[0]->sender;
$receiver = $contact[0]->receiver;
$dateSol = date("Y-m-d h:i:sa");
$type = $contact[0]->type;
$message_subject = $contact[0]->message_subject;
$message_content = $contact[0]->message_content;

//Creamos la conexión
$conexion = mysqli_connect($server, $user, $pass,$bd) 
or die("Ha sucedido un error inexperado en la conexion de la base de datos");

//generamos la consulta
$sql = "INSERT INTO Notification (sender, receiver, dateSol, type, message_subject, message_content)
VALUES('$sender', '$receiver', '$dateSol', '$type', '$message_subject', '$message_content')";
mysqli_set_charset($conexion, "utf8"); //formato de datos utf8

if(!$result = mysqli_query($conexion, $sql)) die();

//desconectamos la base de datos
$close = mysqli_close($conexion) 
or die("Ha sucedido un error inexperado en la desconexion de la base de datos");
?>