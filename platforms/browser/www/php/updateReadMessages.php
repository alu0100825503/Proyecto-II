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
    $notification_sender = $_POST['sender'];
    $notification_receiver = $_POST['receiver'];
    $notification_date = $_POST['date'];
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
$update_query = "UPDATE Notification".
    " SET is_read='1' WHERE sender='$notification_sender' AND receiver='$notification_receiver AND dateSol='$notification_date'";

$result = mysqli_query($connection, $update_query);

if (!$result || mysqli_num_rows($result) <= 0) {
    $json_response['success'] = false;
}
else {
    $json_response['success'] = true;
    mysqli_free_result($result);
}

// Envío del objeto JSON como respuesta
header('Content-type: application/json; charset=utf-8');
echo json_encode($json_response, JSON_FORCE_OBJECT);

// Close connection 
mysqli_close($connection); 
?>