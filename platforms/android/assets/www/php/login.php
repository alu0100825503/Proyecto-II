<?php
session_start();

function checkLogin($username, $password, $db_id)
{
    $sql_login = "SELECT NAME FROM User".
        " WHERE username='$username'";
     
    $result = mysqli_query($db_id, $sql_login);
     
    echo $sql_login;

    if(!$result || mysqli_num_rows($result) <= 0) {
        echo "Fallo en la autenticación";
        return false;
    }

    echo "comprobando password";
    if (/*verificar password*/true) {
        mysqli_free_result($result);
        header("Location: http://localhost:3000/profile.html");
        return true;
    }

    return false;
}

$servername = "mysql.hostinger.es";
$username = "u344358176_calen";
$password = "supercalendar";
$dbname = "u344358176_calen";

$form_username = $_POST['user'];
$form_password = $_POST['pass'];

// Create connection
if(!($id = mysqli_connect($servername, $username, $password))) { 
    die("Error: Could not connect");
}

// Select DB 
if(!mysqli_select_db($id, $dbname)) {
    die("Error: DB does not exist");
}

checkLogin($form_username, $form_password, $id);

// Close connection 
mysqli_close($id); 
?>