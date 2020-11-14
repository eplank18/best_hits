<?php

$username = 'eplank2';
$password = [dummy password];
$dbname = 'cosc465_eplank2';

$conn = mysqli_connect("dbs.eecs.utk.edu", $username, $password, $dbname);

$id = $_GET['assessmentId'];

if ($stmt = mysqli_prepare($conn, "DELETE
	FROM Assessments
	WHERE assessmentId = ?")) {
	mysqli_stmt_bind_param($stmt, "d", $id);

	mysqli_stmt_execute($stmt);

	mysqli_stmt_close($stmt);
}
mysqli_close($conn);

?>
