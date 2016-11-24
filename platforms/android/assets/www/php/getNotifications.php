<?php
header('content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$servername = "mysql.hostinger.es";
$username = "u344358176_calen";
$password = "supercalendar";
$dbname = "u344358176_calen";

$receiver = $_POST['receiver'];

// Objeto JSON que contendrá la respuesta para el cliente
$json_response = array();

// Create connection
if(!$connection = mysqli_connect($servername, $username, $password, $dbname)) {
    die("Error: Could not connect");
}

// Select DB 
if(!mysqli_select_db($connection, $dbname)) {
    die("Error: DB does not exist");
}

$notifications_query = "SELECT sender, receiver, date, type, message_subject, message_content FROM Notification".
    " WHERE receiver='$receiver'";

$result = mysqli_query($connection, $notifications_query);

if (!$result || mysqli_num_rows($result) <= 0) {
    $json_response['success'] = false;
} else {
    $notifications = array();
    $json_response['success'] = true;
    while ($row = mysqli_fetch_assoc($result)) {
        $new_notification = array();
        $new_notification['sender'] = $row['sender'];
        $new_notification['receiver'] = $row['receiver'];
        $new_notification['date'] = $row['date'];
        $new_notification['type'] = $row['type'];
        $new_notification['message_subject'] = $row['message_subject'];
        $new_notification['message_content'] = $row['message_content']; 
        // Append new notification
        $notifications[] = $new_notification;
    }
    $json_response['notifications'] = $notifications;
    mysqli_free_result($result);
}

// Envío del objeto JSON como respuesta para el cliente
header('Content-type: application/json; charset=utf-8');
echo json_encode($json_response, JSON_FORCE_OBJECT);

// Close connection
mysqli_close($connection);
?>