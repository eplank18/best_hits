<?php

$username = 'eplank2';
$password = '68/k4J9g0+d4eJ+f';
$dbname = 'cosc465_eplank2';

$conn = mysqli_connect("dbs.eecs.utk.edu", $username, $password, $dbname);

$id = $_GET['assessmentId'];
$section = $_GET['sectionId'];
$desc = $_GET['assessmentDescription'];
$weight = $_GET['weight'];
$outcome = $_GET['outcomeId'];
$major = $_GET['major'];


if ($stmt = mysqli_prepare($conn, "INSERT INTO Assessments VALUES(?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE sectionId = ?, assessmentDescription = ?, weight = ?, outcomeId = ?, major = ?;
	")) {
	mysqli_stmt_bind_param($stmt, "ddsddsdsdds", $id, $section, $desc, $weight, $outcome, $major, $section, $desc, $weight, $outcome, $major);

	mysqli_stmt_execute($stmt);

	mysqli_stmt_close($stmt);

}
mysqli_close($conn);

?>
