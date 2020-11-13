<link href="nav.css" rel="stylesheet">
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<header>
	<div id="abet"><a href="abet.php"> UTK ABET</a></div>
	<div id="profile" class="dropdown">
	<button id="userMenu" class = "dropbtn"type="button">
		<img class = "pfp" src= "person-fill.svg" alt="profile">
		<img class = "pfp" src="caret-down-fill.svg" alt="down">
	</button> <br>
		<div id = "myDropdown" class="dropdown-content">
			<a id="changePassword" href="password.php">Change Password</a><br>
			<a id="logout" href="login.php">Log Out </a>
		</div>
	</div>
</header>
<nav>
	<div id="sectionMenu"><strong>Section:</strong></div>
	<select>
		<option value="365spr">Dummy Option</option>
		<option value="a">Dummy Option</option>
	</select> <br>
	<span>
	<p id="outcome1" class = "a">Outcome 1</p><hr>
	</span>
</nav>
