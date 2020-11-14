<?php

$username = 'eplank2';
$password = [dummy password];
$dbname = 'cosc465_eplank2';

$conn = mysqli_connect("dbs.eecs.utk.edu", $username, $password, $dbname);

$section = $_GET['sectionId'];
$outcome = $_GET['outcomeId'];
$major = $_GET['major'];
$pLevel = $_GET['performanceLevel'];
$numStudents = $_GET['numberOfStudents'];

if ($stmt = mysqli_prepare($conn, "INSERT INTO OutcomeResults VALUES(?, ?, ?, ?, ?)
	ON DUPLICATE KEY UPDATE numberOfStudents = ?;")) {
	mysqli_stmt_bind_param($stmt, "ddsddd", $section, $outcome, $major, $pLevel, $numStudents, $numStudents);

	mysqli_stmt_execute($stmt);

	mysqli_stmt_close($stmt);

}
mysqli_close($conn);

?>
