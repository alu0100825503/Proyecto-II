<?php
session_start();

function checkLogin($username, $password, $db_id)
{
    $sql_login = "SELECT NAME FROM USERS".
        " WHERE username='$username'";
     
    $result = mysql_query($sql_login, $db_id);
     
    if(!$result || mysql_num_rows($result) <= 0) {
        echo "Fallo en la autenticación";
        return false;
    }

    echo "comprobando password";
    if (/*verificar password*/true) {
        $_SESSION['userid'] = $username;
        mysql_free_result($result);
        header("Location: http://localhost:3000/profile.html");
        return true;
    }

    return false;
}

$servername = "localhost";
$username = "root";
$dbname = "diary_db";

$form_username = $_POST['user'];
$form_password = $_POST['pass'];

// Create connection
if(!($id = mysql_connect($servername, $username, ""))) { 
    die("Error: Could not connect");
}

// Select DB 
if(!mysql_select_db($dbname, $id)) {
    die("Error: DB does not exist");
}

checkLogin($form_username, $form_password, $id);

// Close connection 
mysql_close($id); 
?>