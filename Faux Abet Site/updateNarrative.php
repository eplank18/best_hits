<?php

$username = 'eplank2';
$password = [dummy password];
$dbname = 'cosc465_eplank2';

$conn = mysqli_connect("dbs.eecs.utk.edu", $username, $password, $dbname);

$section = $_GET['sectionId'];
$major = $_GET['major'];
$outcome = $_GET['outcomeId'];
$str = $_GET['strengths'];
$weak = $_GET['weaknesses'];
$act = $_GET['actions'];

if ($stmt = mysqli_prepare($conn, "INSERT INTO Narratives 
	VALUES(?, ?, ?, ?, ?, ?) 
	ON DUPLICATE KEY UPDATE strengths = ?, weaknesses = ?, actions = ?;
")) {
	mysqli_stmt_bind_param($stmt, "dsdssssss", $section, $major, $outcome, $str, $weak, $act, $str, $weak, $act);

	mysqli_stmt_execute($stmt);

	mysqli_stmt_close($stmt);
}
mysqli_close($conn);

?>
