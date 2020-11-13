<?php

$username = 'eplank2';
$password = '68/k4J9g0+d4eJ+f';
$dbname = 'cosc465_eplank2';

$conn = mysqli_connect("dbs.eecs.utk.edu", $username, $password, $dbname);

$instructorId = $_GET['instructorId'];

if ($stmt = mysqli_prepare($conn, "select firstname, lastname, email 
	FROM Instructors
	WHERE instructorId = ?")) {
	mysqli_stmt_bind_param($stmt, "d", $instructorId);

	mysqli_stmt_execute($stmt);

	mysqli_stmt_bind_result($stmt, $first, $last, $email);

	$resultArray = array();

	while (mysqli_stmt_fetch($stmt)) {
		array_push($resultArray, array("firstname" => $first,
					"lastname" => $last, 
					"email" => $email));
	}

	mysqli_stmt_close($stmt);

	echo json_encode($resultArray);
}
mysqli_close($conn);

?>

