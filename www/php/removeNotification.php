<?php
header('content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

/*
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "u344358176_calen";
*/

$servername = "mysql.hostinger.es";
$username = "u344358176_calen";
$password = "supercalendar";
$dbname = "u344358176_calen";

if (isset($_POST)) {
    $sender = $_POST['sender'];
    $receiver = $_POST['receiver'];
    $date = $_POST['date'];
}

// Objeto JSON que contendrá la respuesta para el cliente
$json_response = array();

// Create connection
if(!($connection = mysqli_connect($servername, $username, $password))) { 
    die("Error: Could not connect");
}

// Select DB 
if(!mysqli_select_db($connection, $dbname)) {
    die("Error: DB does not exist");
}

// Comprobar primero que no existe el nombre de usuario en la base de datos
$delete_notification_query = "DELETE FROM Notification".
    " WHERE sender='$sender' AND receiver='$receiver' AND dateSol='$date'";

$result = mysqli_query($connection, $delete_notification_query);

if ($result == false) {
    $json_response['success'] = false;
}
else {
    $json_response['success'] = true;
}

// Envío del objeto JSON como respuesta
header('Content-type: application/json; charset=utf-8');
echo json_encode($json_response, JSON_FORCE_OBJECT);

// Close connection 
mysqli_close($connection); 
?>