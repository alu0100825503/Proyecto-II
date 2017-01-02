<?php
//Primero, arranca el bloque PHP y checkea si el archivo tiene nombre.  Si no fue asi, te remite de nuevo al formulario de inserción:
// No se comprueba aqui si se ha subido correctamente.
if (empty($_FILES['archivo']['name'])){
  header("location: formulario.php?proceso=falta_indicar_fichero"); //o como se llame el formulario ..
  exit;
}

//establece una conexión con la base de datos.

//$conexion = mysql_connect("localhost","","") or die("No se pudo realizar la conexion con el servidor.");
$conexion = new mysqli("mysql.hostinger.es","u344358176_calen","supercalendar","u344358176_calen") or die("No se pudo realizar la conexion con el servidor.");

//mysql_select_db("archivos",$conexion) or die("No se puede seleccionar BD"); // tu_bd es el nombre de la Base de datos .. por siaca.

// archivo temporal (ruta y nombre).
$binario_nombre_temporal=$_FILES['archivo']['tmp_name'] ;

// leer del archvio temporal .. el binario subido.
// "rb" para Windows .. Linux parece q con "r" sobra ...
$binario_contenido = addslashes(fread(fopen($binario_nombre_temporal, "rb"), filesize($binario_nombre_temporal)));

// Obtener del array FILES (superglobal) los datos del binario .. nombre, tabamo y tipo.
$binario_nombre=$_FILES['archivo']['name'];
$binario_peso=$_FILES['archivo']['size'];
$binario_tipo=$_FILES['archivo']['type'];
$id = 0;
//insertamos los datos en la BD.
$consulta_insertar = "INSERT INTO Files (data, size, type, name) VALUES ('$binario_contenido', '$binario_peso', '$binario_tipo', '$binario_nombre')";
$consulta_id = "SELECT `id` FROM `Files` WHERE (`name` = '$binario_nombre')";
if ( $conexion->query($consulta_insertar)){
  if ($respuesta = $conexion->query($consulta_id)){
    if ($respuesta->num_rows > 0){
      foreach ($respuesta as $row) {
          $id = $row['id'];
      }
    }
  }

} else {
  die("No se pudo insertar los datos en la base de datos.");
}

//mysql_query($consulta_insertar,$conexion) or die("No se pudo insertar los datos en la base de datos.");
//header("location: listar_imagenes.php");  // si ha ido todo bien
header("Content-Type: text/plain");
echo $id;
exit;
?>
