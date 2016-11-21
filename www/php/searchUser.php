<?php 
$server = "mysql.hostinger.es";
$user = "u344358176_calen";
$pass = "supercalendar";
$bd = "u344358176_calen";

$event = json_decode($_GET['eventData']);
$userToSearch = $event[0]->username;

//Creamos la conexión
$conexion = mysqli_connect($server, $user, $pass,$bd) 
or die("Ha sucedido un error inexperado en la conexion de la base de datos");

//generamos la consulta
$sql = "SELECT username FROM User WHERE username LIKE '%$userToSearch%'";
mysqli_set_charset($conexion, "utf8"); //formato de datos utf8

if(!$result = mysqli_query($conexion, $sql)) die();

$users = array(); //creamos un array

while($row = mysqli_fetch_array($result)) 
{ 
    $userFound=$row['username'];

    $users[] = array('username'=> $userFound);
}

//desconectamos la base de datos
$close = mysqli_close($conexion) 
or die("Ha sucedido un error inexperado en la desconexion de la base de datos");

//Creamos el JSON
$json_string = json_encode($users);
echo $json_string;
?>