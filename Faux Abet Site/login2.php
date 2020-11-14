<?php

$username = 'eplank2';
$password = [dummy password];
$dbname = 'cosc465_eplank2';

$conn = mysqli_connect("dbs.eecs.utk.edu", $username, $password, $dbname);

$email2 = $_POST['email'];
$password = $_POST['password'];


if ($stmt = mysqli_prepare($conn, "SELECT DISTINCT instructorId, sectionId, courseId, major, semester, year FROM Instructors NATURAL JOIN Sections NATURAL JOIN CourseOutcomeMapping WHERE email = ? AND password = PASSWORD(?) ORDER BY year DESC, semester ASC;")) {


		mysqli_stmt_bind_param($stmt, "ss", $email2, $password);

	mysqli_stmt_execute($stmt);
	mysqli_stmt_bind_result($stmt, $instructorId, $sectionId, $courseId, $major, $semester, $year);

	$resultArray = array();

	while (mysqli_stmt_fetch($stmt)) {
		array_push($resultArray, array("instructorId" => $instructorId,
		"sectionId" => $sectionId,
		"courseId" => $courseId,
		"major" => $major,
		"semester" => $semester,
		"year" => $year));
	}

	mysqli_stmt_close($stmt);


	if(json_encode($resultArray) != []){
	session_start();
	$_SESSION["data"] = json_encode($resultArray);
	header("Location: abet.php");
	}
	else {
		header("Location: login.php");
	}   
}

mysqli_close($conn);
?>
