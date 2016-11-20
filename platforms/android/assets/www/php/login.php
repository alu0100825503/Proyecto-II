<?php
header('content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

function checkLogin($username, $password, $db_id)
{
    $sql_login = "SELECT NAME FROM User".
        " WHERE username='$username' AND password='$password'";
    
    $result = mysqli_query($db_id, $sql_login);
     
    if(!$result || mysqli_num_rows($result) <= 0) {
        return false;
    } 
    else {
        mysqli_free_result($result);
        return true;
    }
}

$servername = "mysql.hostinger.es";
$username = "u344358176_calen";
$password = "supercalendar";
$dbname = "u344358176_calen";

/*
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "u344358176_calen";
*/

$form_username = $_POST['username'];
$form_password = $_POST['password'];

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

$result = checkLogin($form_username, $form_password, $connection);

if ($result) {
    $json_response['success'] = true;
    $json_response['username'] = $form_username;
    $json_response['password'] = $form_password;
} else {
    $json_response['success'] = false;
}

// Envío del objeto JSON como respuesta para el cliente
header('Content-type: application/json; charset=utf-8');
echo json_encode($json_response, JSON_FORCE_OBJECT);

// Close connection
mysqli_close($connection); 
?>