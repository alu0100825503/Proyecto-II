<?php
if(isset($_GET['id'])) {

  // you may have to modify login information for your database server:
  $conexion=mysql_connect("localhost","","") or die ("no se ha podido conectar a la BD");

  //mysql_select_db("tu_bd") or die ("no se ha podido seleccionar la BD");
  $conexion = new mysqli("mysql.hostinger.es","u344358176_calen","supercalendar","u344358176_calen") or die("No se pudo realizar la conexion con el servidor.");

  $sql = "SELECT name,size,type,data FROM Files WHERE id='".$_GET['id']."'";
  $datos = null;
  $tipo = null;
  $nombre = null;
  $peso = null;

  if ($respueta = $conexion->query($sql)){
    foreach ($respuesta as $row) {
      $nombre = $row ['name'];
      $tipo = $row ['type'];
      $peso = $row ['size'];
      $datos = $row ['data'];
    }
  } else {
    die("No se pudo obtener los datos en la base de datos.");
  }

  header("Content-type: $tipo");
  header("Content-length: $peso");
  header("Content-Disposition: inline; filename=$nombre");

  echo $datos;

}
?>
