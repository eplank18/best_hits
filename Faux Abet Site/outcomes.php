<?php

$username = 'eplank2';
$password = '68/k4J9g0+d4eJ+f';
$dbname = 'cosc465_eplank2';

$conn = mysqli_connect("dbs.eecs.utk.edu", $username, $password, $dbname);
$sectionId = $_GET['sectionId'];
$major = $_GET['major'];

if($stmt = mysqli_prepare($conn, "SELECT outcomeId, outcomeDescription
	FROM Sections NATURAL JOIN Outcomes NATURAL JOIN CourseOutcomeMapping 
	WHERE sectionId = ? AND major = ?
	ORDER BY outcomeId;")) {
	mysqli_stmt_bind_param($stmt, "is", $sectionId, $major);

	mysqli_stmt_execute($stmt);

	mysqli_stmt_bind_result($stmt, $outcome, $desc);

	$resultArray = array();

	while (mysqli_stmt_fetch($stmt)) {
		array_push($resultArray, array("outcomeId" => $outcome,
		"outcomeDescription" => $desc));
	}
	mysqli_stmt_close($stmt);

	echo json_encode($resultArray);
}

mysqli_close($conn);

?>
