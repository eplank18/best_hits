<html>
<link href="abet.css" rel="stylesheet">
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="abet.js"></script>
<script src="nav.js"></script>
<body>
	<?php include "nav.php"; ?>
	<main>
	<div id="result">
	  <div class="title"> <strong>Results</strong></div><br>
	  <p class = "txt">Please enter the number of students who do not meet expectations, meet expectations, and exceed expectations. You can type directly into the boxes--you do not need to use arrows.</p>
	  <p class="bloc"><strong>Outcome 2 - CS:</strong> Design, implement, and evaluate a computing-based solution to meet a given set of computing requirements in the context of the program's discipline.</p>
	  <div class="grid1">
		<strong class = "grid-item">Not Meets Expectations</strong>
		<strong class = "grid-item">Meets Expectations</strong>
		<strong class = "grid-item">Exceeds Expectations</strong>
		<strong class = "grid-item">Total</strong>
		<input class = "num" type="number" value="0" min = "0" id = "notMeetsExpectations">
		<input class = "num" type="number" value="0" min = "0" id = "meetsExpectations">
		<input class = "num" type="number" value="0" min = "0" id = "exceedsExpectations">
		<span id="total">0</span>
	</div>
	<button class="save" type="button" id="saveResults">Save Results</button><br>
	<p class = "hidden" class = "error" id="resultsSuccess">Results saved.</p>
	<p class = "hidden" class = "error"id="resultsFail">ERROR: Results could not be saved.</p>
	<br><br><br>
	</div>
	<div class="title"> <strong>Assessment Plan</strong></div><br>
	<div class="txt"><ol>
	  <li>Please enter your assessment plan for each outcome. The weights are percentages from 0-100 and the weights should add up to 100%.</li>
	  <li>Always press "Save Assessments" when finished, even if you removed an assessment. The trash can only removes an assessment from this screen-it does not remove it from the database until you press "Save Assessments".</li>
	  </ol>
	  </div>
	  <div class="grid3">
		<strong class = "grid-item">Weight(%)</strong>
		<strong class = "grid-item">Description</strong>
		<strong class = "grid-item">Remove</strong>
		<input class = "num" type = "number" value = "one" min = "0" max = "100">
		<textarea class="num" rows = "2" maxlength = "400"></textarea>
		<img class = "trash" src = "trash.svg" name = "0" alt = "remove">
		<input class = "num" type = "number" value = "one" min = "0" max = "100">
		<textarea class="num" rows = "2" maxlength = "400"></textarea>
		<img class = "trash" src = "trash.svg" name = "1" alt = "remove">
		<input class = "num" type = "number" value = "one" min = "0" max = "100">
		<textarea class="num" rows = "2" maxlength = "400"></textarea>
		<img class = "trash" src = "trash.svg" name = "2" alt = "remove">
		<input class = "num" type = "number" value = "one" min = "0" max = "100">
		<textarea class="num" rows = "2" maxlength = "400"></textarea>
		<img class = "trash" src = "trash.svg" name = "3" alt = "remove">
	</div>
	<hr>
	<button class="new" type="button" id = "newAssessment">+ New</button>
	<br>
	<button class="save" type="button" id = "saveAssessments">Save Assessments</button>
	<br>
	<p class = "hidden" class = "error" id="assessmentsSuccess">Assessments saved.</p>
	<p class = "hidden" class = "error" id="assessmentsFail">ERROR: Assessments could not be saved.</p>
	<p class = "hidden" class = "error" id="weightsNot100">ERROR: Weights do not add to 100.</p>
	<br><br><hr>
	<div class="title"><strong>Narrative Summary</strong></div>
	<p class="txt">Please enter your narrative for each outcome, including the student strenghts for the outcome, student weaknesses for the outcomes, and suggested actions for improving student attainment of each outcome.</p>
	<strong class="txt">Strengths</strong><br>
	<textarea class="num2" id = "strengths" rows = "3" maxlength = "2000"> None </textarea>
	<strong class="txt">Weaknesses</strong><br>
	<textarea class="num2" id = "weaknesses" rows = "3" maxlength = "2000"> None </textarea>
	<strong class="txt">Actions</strong><br>
	<textarea class="num2" id = "actions"rows = "3" maxlength = "2000"> None </textarea>
	<button class="save" id = "saveNarrative" type="button">Save Narrative</button>
	<p class = "hidden" class = "error" id="narrativeSuccess">Narratives saved.</p>
	<p class = "hidden" class = "error" id="narrativeFail">ERROR: Narratives could not be saved.</p>
	</main>
</body>
</html>
