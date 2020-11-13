<?php

$username = 'eplank2';
$password = '68/k4J9g0+d4eJ+f';
$dbname = 'cosc465_eplank2';

$conn = mysqli_connect("dbs.eecs.utk.edu", $username, $password, $dbname);

$password = $_GET['password'];
$email = $_GET['email'];

if ($stmt = mysqli_prepare($conn, "UPDATE Instructors
	SET password = PASSWORD(?)
	WHERE email = ?;")) {
	mysqli_stmt_bind_param($stmt, "ss", $password, $email);

	mysqli_stmt_execute($stmt);

	mysqli_stmt_close($stmt);

}
mysqli_close($conn);

?>
