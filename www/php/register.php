<?php
session_start();

$servername = "localhost";
$username = "root";
$dbname = "diary_db";

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
if(!($id = mysql_connect($servername, $username, ""))) { 
    die("Error: Could not connect");
}

// Select DB 
if(!mysql_select_db($dbname, $id)) {
    die("Error: DB does not exist");
}

$sql_insert = "INSERT INTO USERS VALUES ".
    "('".$form_username."','".
    $form_name."','".
    $form_lastname."','".
    $form_password."','".
    $form_date."');";

echo $_SESSION['userid'];

if (!mysql_query($sql_insert, $id)) {
    die("Error: Could not execute the query");
}

// Close connection 
mysql_close($id); 
?>