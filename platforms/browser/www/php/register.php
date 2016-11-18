<?php
session_start();

/*
$servername = "localhost";
$username = "root";
$dbname = "diary_db";
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

/*DEGUB LINES
echo $form_username;
echo $form_password;
echo $form_name;
echo $form_lastname;
echo $form_date;
*/

// Create connection
if(!($id = mysqli_connect($servername, $username, $password))) { 
    die("Error: Could not connect");
}

// Select DB 
if(!mysqli_select_db($id, $dbname)) {
    die("Error: DB does not exist");
}

$sql_insert = "INSERT INTO User VALUES ".
    "('".$form_username."','".
    $form_name."','".
    $form_lastname."','".
    $form_password."','".
    $form_date."');";

echo $_SESSION['userid'];

if (!mysqli_query($id, $sql_insert)) {
    die("Error: Could not execute the query");
}

// Close connection 
mysqli_close($id); 
?>