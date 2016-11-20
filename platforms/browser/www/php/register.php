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
    $form_username = $_POST['username'];
    $form_password = $_POST['password'];
    $form_name = $_POST['name'];
    $form_lastname = $_POST['lastname'];
    $form_date = $_POST['date'];
    $form_email = $_POST['email'];
    $form_tel = $_POST['tel'];
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
$sql_select_username = "SELECT NAME FROM User".
    " WHERE username='$form_username';";

$result_name = mysqli_query($connection, $sql_select_username);

if (!$result_name || mysqli_num_rows($result_name) <= 0) {
    // Comprobar ahora que no existe el correo electrónico
    $sql_select_email = "SELECT NAME FROM User".
        " WHERE email='$form_email';";

    $result_email = mysqli_query($connection, $sql_select_email);

    if (!$result_email || mysqli_num_rows($result_email) <= 0) {
        // Insertamos al nuevo usuario si no existe el nombre de usuario
        // y correo electrónico insertados
        $sql_insert = "INSERT INTO User VALUES ".
        "('".$form_username."','".
        $form_name."','".
        $form_lastname."','".
        $form_password."','".
        $form_date."','".
        $form_email."','".
        $form_tel."', NULL, NULL);";

        $result_insert = mysqli_query($connection, $sql_insert);

        if (!$result_insert) {
            $json_response['success'] = false;
        } else {
            $json_response['success'] = true;
            $json_response['username'] = $form_username;
            $json_response['password'] = $form_password;
        }
    } else {
        $json_response['success'] = false;
        $json_response['emailAlreadyExists'] = true;
        mysqli_free_result($result_email);
    }
}
else {
    $json_response['success'] = false;
    $json_response['userAlreadyExists'] = true;
    mysqli_free_result($result_name);
}

// Envío del objeto JSON como respuesta
header('Content-type: application/json; charset=utf-8');
echo json_encode($json_response, JSON_FORCE_OBJECT);

// Close connection 
mysqli_close($connection); 
?>