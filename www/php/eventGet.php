<?php 
$server = "mysql.hostinger.es";
$user = "u344358176_calen";
$pass = "supercalendar";
$bd = "u344358176_calen";

//Creamos la conexión
$conexion = mysqli_connect($server, $user, $pass,$bd) 
or die("Ha sucedido un error inexperado en la conexion de la base de datos");

//generamos la consulta
$sql = "SELECT * FROM Event";
mysqli_set_charset($conexion, "utf8"); //formato de datos utf8

if(!$result = mysqli_query($conexion, $sql)) die();

$events = array(); //creamos un array

while($row = mysqli_fetch_array($result)) 
{ 
    $id=$row['id'];
    $name=$row['name'];
    $creator=$row['creator'];
    $start=$row['start'];
    $finish=$row['finish'];
    $private=$row['private'];

    $events[] = array('id'=> $id, 'name' => $name, 'creator'=> $creator, 'start'=> $start, 'finish'=> $finish,
                        'isPrivate'=> $private);
}

//desconectamos la base de datos
$close = mysqli_close($conexion) 
or die("Ha sucedido un error inexperado en la desconexion de la base de datos");

//Creamos el JSON
$json_string = json_encode($events);
echo $json_string;
?>