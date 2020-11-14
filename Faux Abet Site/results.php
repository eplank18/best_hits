<?php

$username = 'eplank2';
$password = [dummy password];
$dbname = 'cosc465_eplank2';

$major = $_GET['major'];
$outcome = $_GET['outcomeId'];
$sectionId = $_GET['sectionId'];


$conn = mysqli_connect("dbs.eecs.utk.edu", $username, $password, $dbname);

if ($stmt = mysqli_prepare($conn, "SELECT description, sum(numberOfStudents)
	FROM OutcomeResults NATURAL JOIN PerformanceLevels
	WHERE major = ? AND sectionId = ? AND outcomeId = ?
	GROUP BY performanceLevel
	ORDER BY performanceLevel;")) {
	
	mysqli_stmt_bind_param($stmt, "sii", $major, $sectionId, $outcome);

	mysqli_stmt_execute($stmt);

	mysqli_stmt_bind_result($stmt, $desc, $sum);

	$resultArray = array();

	while (mysqli_stmt_fetch($stmt)) {
		array_push($resultArray, array(
		"description" => $desc,
		"numberOfStudents" => $sum));
	}
	mysqli_stmt_close($stmt);

	echo json_encode($resultArray);
}
mysqli_close($conn);

?>
