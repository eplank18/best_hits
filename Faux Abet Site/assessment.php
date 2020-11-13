<?php

$username = 'eplank2';
$password = '68/k4J9g0+d4eJ+f';
$dbname = 'cosc465_eplank2';

$conn = mysqli_connect("dbs.eecs.utk.edu", $username, $password, $dbname);

$major = $_GET['major'];
$outcome = $_GET['outcomeId'];
$section = $_GET['sectionId'];

if ($stmt = mysqli_prepare($conn, "select assessmentId, assessmentDescription, weight FROM Assessments WHERE major = ? AND outcomeId = ? AND sectionId = ? ORDER BY assessmentDescription ASC;")) {
	mysqli_stmt_bind_param($stmt, "sdd", $major, $outcome, $section);

	mysqli_stmt_execute($stmt);

	mysqli_stmt_bind_result($stmt, $assessId, $desc, $weight);

	$resultArray = array();

	while (mysqli_stmt_fetch($stmt)) {
		array_push($resultArray, array("assessmentId" => $assessId, "assessmentDescription" => $desc,
		"weight" => $weight));
	}

	mysqli_stmt_close($stmt);

	echo json_encode($resultArray);
}
mysqli_close($conn);

?>
