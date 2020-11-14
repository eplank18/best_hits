<?php

$username = 'eplank2';
$password = [dummy password];
$dbname = 'cosc465_eplank2';

$conn = mysqli_connect("dbs.eecs.utk.edu", $username, $password, $dbname);

$section = $_GET['sectionId'];
$desc = $_GET['assessmentDescription'];
$weight = $_GET['weight'];
$outcome = $_GET['outcomeId'];
$major = $_GET['major'];


if ($stmt = mysqli_prepare($conn, "SELECT assessmentId
	FROM Assessments
	WHERE sectionId = ? AND assessmentDescription = ? AND weight = ? AND outcomeId = ? AND major = ?"
	)) {
	mysqli_stmt_bind_param($stmt, "dsdds", $section, $desc, $weight, $outcome, $major);

	mysqli_stmt_execute($stmt);

	mysqli_stmt_bind_result($stmt, $id);

	$resultArray = array();
	
	while (mysqli_stmt_fetch($stmt)) {
		array_push($resultArray, array("assessmentId" => $id));
	}

	echo json_encode($resultArray);

	mysqli_stmt_close($stmt);

}
mysqli_close($conn);

?>
