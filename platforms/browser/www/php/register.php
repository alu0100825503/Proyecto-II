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

$form_username = $_POST['user'];
$form_password = $_POST['pass'];
$form_name = $_POST['realname'];
$form_lastname = $_POST['lastname'];
$form_date = $_POST['date'];
$form_email = $_POST['email'];
$form_tel = $_POST['tel'];

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
$sql_select_username = "SELECT NAME FROM User".
    " WHERE username='$form_username';";

$result_name = mysqli_query($connection, $sql_select_username);

if ($result_name) {
    $json_response['success'] = false;
    $json_response['userAlreadyExists'] = true;
}
else {
    // Comprobar ahora que no existe el correo electrónico
    $sql_select_email = "SELECT NAME FROM User".
        " WHERE email='$form_email';";

    $result_email = mysqli_query($connection, $sql_select_email);

    if ($result_email) {
        $json_response['success'] = false;
        $json_response['emailAlreadyExists'] = true;
    } else {
        // Insertamos finalmente al nuevo usuario si no existe el nombre de usuario
        // y correo electrónico insertados
        $sql_insert = "INSERT INTO User VALUES ".
        "('".$form_username."','".
        $form_name."','".
        $form_lastname."','".
        $form_password."','".
        $form_date."','".
        $form_email."','".
        $form_tel."');";

        $result = mysqli_query($connection, $sql_insert);

        if ($result) {
            $json_response['success'] = true;
            $json_response['username'] = $form_username;
            $json_response['password'] = $form_password;
        } else {
            $json_response['success'] = false;
        }
    }
}

// Envío del objeto JSON como respuesta
header('Content-type: application/json; charset=utf-8');
echo json_encode($json_response, JSON_FORCE_OBJECT);

// Set the result memory free
mysqli_free_result($result);

// Close connection 
mysqli_close($connection); 
?>