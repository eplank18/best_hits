<link href="login.css" rel="stylesheet">
<?php
    session_start();
    $_SESSION = array();
    session_destroy();
?>
<div id="sign-in">
  Please Sign In
</div>

<form method = "post" action = "login2.php">
  <div>
    <input type= "email" placeholder="E-mail" name = "email">
  </div>
  <div>
  <input type="password" placeholder="Password" name = "password">
  </div>
  <div>
    <input type="submit" value="login">
    </div>
</form>
