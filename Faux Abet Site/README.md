This is a website that consists of a login page, and a main page that shows data for a given class, and allows both for reading and changing said data. The site can still be viewed, but the database it connected to is no longer active.

![Image of Login](https://github.com/eplank18/best_hits/blob/main/Faux%20Abet%20Site/Login%20Example.PNG)
<br><p>This is the login page. Login.php handles displaying the form, and when the submit button is pressed, running a php file to check the database for if the user exists with that information, and if so, logging them in and pulling up their data.</p>

![Image of Password Page](https://github.com/eplank18/best_hits/blob/main/Faux%20Abet%20Site/Password%20Example.PNG)
<p>The banner at the top is handled by a separate php page, and once you're logged in, is constant between the main page and this one. It shows dummy data, since the database I used it for is down, but if it were still up, the Dummy Options would be classes associated with the user in the database, and you would be able to pick between them.</p>
<p>The main page being displayed there is the "change password" page. If there were a person logged in, it would show their name and email, and the form would take in the new password, and, after error checking it for having a lowercase and uppercase letter, a number, and being the same in both boxes, would go into the database and update it.</p>

![Image of Abet Page](https://github.com/eplank18/best_hits/blob/main/Faux%20Abet%20Site/Abet%20Example.png)
<p>This is a screenshot I have of dummy data while the database was still up. This is the main part of the website-the sql server would be queried for the data associated with the given user, section, and outcome, and from there, they could adjust the assessments there-change their weights, change their descriptions, add some, and click the red trash can icons to delete some.</p>
