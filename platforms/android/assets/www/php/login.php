<?php
header('content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

function checkLogin($username, $password, $db_id)
{
    $sql_login = "SELECT NAME FROM USER".
        " WHERE username='$username'";
    
    $result = mysqli_query($db_id, $sql_login);
     
    if(!$result || mysqli_num_rows($result) <= 0) {
        return false;
    } 
    else if (true) {
        // TODO: comprobar contraseña
        mysql_free_result($result);
        return true;
    }

    return false;
}

/*
$servername = "mysql.hostinger.es";
$username = "u344358176_calen";
$password = "supercalendar";
$dbname = "u344358176_calen";
*/

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "u344358176_calen";

$form_username = $_POST['username'];
$form_password = $_POST['password'];

// Objeto JSON que contendrá la respuesta para el cliente
$json_response = array();

echo "json";

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

// Envío del objeto JSON como respuesta
header('Content-Type: application/json');
echo json_encode($json_response);

// Close connection
mysqli_close($connection); 
?>