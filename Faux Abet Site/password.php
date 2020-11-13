<html>
<link href="password.css" rel="stylesheet">
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="nav.js"></script>
<body>
	<?php include "nav.php"; ?>
	<h1>Change Password</h1>
	<hr>
	<div class="box1">
	<div class="top">Basic Info </div><br>
	<div class="bottom">
		<span id="currname"><strong>Name:</strong></span>
		<span id="curremail"><strong>Email:</strong></span>
	</div>
	</div>
<div class = "box2">
	<p class="top">Change Password </p><br>
  <div>
	  <strong>New Password</strong><br><br>
    <input type= "password" id = "newPassword"><br><br>
  </div>
  <div>
	  <strong>Confirm Password</strong><br><br>
  <input type="password"  id = "confirmPassword"><br><br>
  </div>
  <div>
    <input type="submit" value="Submit" id="submitPassword"><span id="passwordError" class="hidden">ERROR. Passwords unchanged.</span><span id="passwordSucceeded" class="hidden">Password changed.</span>
    </div>
</div>
</body>
