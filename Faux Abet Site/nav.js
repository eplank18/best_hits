$(document).ready(function() {
		var instructorId;
		var instructorData;
		var instructorEmail;
		var i;
		var sectId;
		var currentSection = -1;
		var currentMajor = -1;
		var currentOutcome = -1;
		var currentdesc = -1;
		var numOutcomes;
		var numAssessments;
		var assessments = [];
		var assessmentsToDelete = [];
		var outcomeData;
		var change1;
		var change2;
		var change3;
		
		change1 = 0;
		change2 = 0;
		change3 = 0;
		console.log("running");
		$.ajax({
			url: "navstart.php",
			method: "GET",
			data: "",
			dataType: "json"
		})
		.done(function(data) {
			console.log(data);
			sectId = 1;
			console.log(data[0]);
			console.log(data.length);
			var temp;
			var optionName;
			instructorData = data;
			$("select option").remove();
			for(i = 0; i < data.length; i++)
			{
				optionName = data[i].courseId + " " + data[i].semester + " " + data[i].year;
				temp = "section" + sectId;
				temp = '<option id="' + temp + '" name = ' + sectId + '>'+optionName+'</option>';
				$("select").append(temp);
				sectId = parseInt(sectId) + 1;
			}
			currentSection = data[0].sectionId;
			currentMajor = data[0].major;
			instructorId = data[0].instructorId;
			changeOutcomes();
			console.log(instructorId);
			$.ajax({
				url: "instructor.php",
				method: "GET",
				data: {instructorId: instructorId},
				dataType: "json"
			})
			.done(function(data) {
				temp = data[0];
				optionName = " "+ temp.firstname + " "+ temp.lastname;
				$("#currname").append(optionName);
				optionName = " " + temp.email;
				instructorEmail = temp.email;
				$("#curremail").append(optionName);
			});
			});
			
	function resultenter() {
		change1 = 1;
		console.log("You intereacted with the results section!\n");
		var notmeet = parseInt($(".grid1 .num:eq(0)").val());
		var meet = parseInt($(".grid1 .num:eq(1)").val());
		var exceed = parseInt($(".grid1 .num:eq(2)").val());
		if(isNaN(notmeet)) notmeet = 0;
		if(isNaN(meet)) meet = 0;
		if(isNaN(exceed)) exceed = 0;
		var total = notmeet + meet + exceed + 0;
		console.log("Notmeet: ", notmeet, ", Meet: ", meet, ", Exceed: ", exceed, ", Total: ", total);
		$(".grid1 span").html(total);
	}
	function assessmentChange() {
		change2 = 1;
	}

	$(".grid1 .num").on('change', resultenter);
		function trashman(event) {
			var temp;
			var index = $(".trash").index(event.target);
			var query = ".trash:eq(" + index + ")";
			temp = $(query).attr('id');
			temp = temp.substr(5);
			assessmentsToDelete.push(assessments[parseInt(temp) * 2 - 1]);
			console.log(assessmentsToDelete);
			console.log("You want to throw ", index, " away!");
			console.log("Query is ", query);
			$(query).remove();
			temp = parseInt(index) * 2;
			query = ".grid3 .num:eq(" + temp + ")";
			console.log("Query is now ", query);
			$(query).remove();
			query = ".grid3 textarea:eq(" + index + ")";
			$(query).remove();
		}

		function outcomeClicked() {
						var num = $(this).prop("id");
			num = num.substring(7);
			var temp;
			temp = outcomeData[parseInt(num)-1].outcomeDescription;
			console.log(temp);
			if((change1 + change2 + change3) == 0) {
				currentOutcome = num;
				currentdesc = temp;
				$(".a").removeClass("selected");
				$(this).addClass("selected");
			}
			updatePage();
			
		}
		function updatePage() {
			if((change1 + change2 + change3) != 0) {
				alert("WARNING! Changes not saved!");
			}
			else {
				$(".error").addClass("hidden");
				change1 = 0;
				change2 = 0;
				change3 = 0;
				$(".bloc").remove();
				 temp = "<p class='bloc'><strong>Outcome " + currentOutcome + " - " + currentMajor + ":</strong> " + currentdesc;
				 $("#result .txt").append(temp);
				var requestData = {sectionId : currentSection, major : currentMajor, outcomeId: currentOutcome};
				$.ajax({
					url: "results.php",
					method: "GET", 
					data: requestData,
					dataType: "json"
				})
				.done(function(data) {
					console.log(data);
					if(data.length != 0) {
					$("#notMeetsExpectations").prop("value", data[0].numberOfStudents);
					$("#meetsExpectations").prop("value", data[1].numberOfStudents);
					$("#exceedsExpectations").prop("value", data[2].numberOfStudents);
					var total = parseInt(data[0].numberOfStudents)
					+parseInt(data[1].numberOfStudents)
					+parseInt(data[2].numberOfStudents);
					//$(".grid1 span").html(total);
					$("#total").html(total);}
				});
				requestData = {sectionId : currentSection, major : currentMajor, outcomeId: currentOutcome};
				$.ajax({
					url: "assessment.php",
					method: "GET", 
					data: requestData,
					dataType: "json"
				})
				.done(function(data) {
					var i;
					var tag;
					var temp;
					numAssessments = 1;
					assessments = [];
					console.log(data);
					$(".trash").remove();
					$(".grid3 .num").remove();
					$(".grid3 textarea").remove();
					for(i = 0; i < data.length; i++) {
						if(data[i].weight != null) {
							tag = "weight" + numAssessments;
							temp = '<input class = "num" type = "number" id = ' + tag + ' value = ' + data[i].weight + ' min = "0" max = "100" required>';
							$(".grid3").append(temp);
							tag = "#" + tag;
							$(tag).on('change', assessmentChange);
							tag = "assessment" + numAssessments;
							temp = '<textarea class = "num" id = ' + tag + ' rows = "2" maxlength = "400">' + data[i].assessmentDescription + '</textarea>';
							$(".grid3").append(temp);
							tag = "#" + tag;
							$(tag).on('change', assessmentChange);
							tag = "trash" + numAssessments;
							temp = '<img class = "trash" id = ' + tag + ' src = "trash.svg" name = "3" alt = "remove">';
							$(".grid3").append(temp);
							tag = "#" + tag;
							$(tag).click(trashman);
							assessments.push(numAssessments);
							assessments.push(data[i].assessmentId);
							numAssessments++;
						}
					}
					newassessment();
					assessmentsToDelete = [];
				});
				$.ajax({
					url: "narrative.php",
					method: "GET", 
					data: requestData,
					dataType: "json"
				})
				.done(function(data) {
					for(i = 0; i < data.length; i++)
					{
						$("#strengths").html(data[i].strengths);
						$("#weaknesses").html(data[i].weaknesses);
						$("#actions").html(data[i].actions);
					}
					if(data.length == 0) {
						$("#strengths").html("None");
						$("#weaknesses").html("None");
						$("#actions").html("None");
					}
				});
		}
		}

		function changeOutcomes()
		{
			console.log("Running.");
			 var requestData = {sectionId : currentSection, major : currentMajor};
			 console.log(requestData);
			 $.ajax({
				 url: "outcomes.php",
				 method: "GET",
				 data: requestData,
				 dataType: "json"
			 })
			 .done(function(data) {
				 outcomeData = data;
				 var outcome;
				 var temp;
				 $("nav p, nav hr").remove();
				 numOutcomes = data.length;
				 for(i = 0; i < data.length; i++)
				 {
					outcome = "outcome" + data[i].outcomeId;
					console.log(outcome);
					temp = '<p id="' + outcome + '" class = "a">Outcome ' + data[i].outcomeId + '</p><hr>';
					$("nav span").append(temp);
					outcome = "#" + outcome;
					$(outcome).click(outcomeClicked);
				 }
				 currentOutcome = data[0].outcomeId;
				 currentdesc = data[0].outcomeDescription;
				 $("#outcome1").addClass("selected");
				 updatePage();
			 });
		}

		function newSection() {
			var index = $(this).prop('selectedIndex');
			currentSection = instructorData[index].sectionId;
			currentMajor = instructorData[index].major;
			changeOutcomes();
		}
		$("select").on('change', newSection);
		
		function myFunction() {
		console.log("pfp clicked!");
		$("#myDropdown").toggleClass("show");
		}
		function resultsave() {
			var notmeet = parseInt($(".grid1 .num:eq(0)").val());
			var meet = parseInt($(".grid1 .num:eq(1)").val());
			var exceed = parseInt($(".grid1 .num:eq(2)").val());
			if(isNaN(notmeet)) notmeet = 0;
			if(isNaN(meet)) meet = 0;
			if(isNaN(exceed)) exceed = 0;
			console.log("You want to save ", notmeet, ", ", meet, ", and ", exceed, "!");
			console.log(currentOutcome);
			if(notmeet == 0 || meet == 0 || exceed == 0){
				$("#resultsSuccess").addClass("hidden");
				$("#resultsFail").removeClass("hidden");
			} else {
			var requestData = {sectionId : currentSection, major : currentMajor, outcomeId: currentOutcome, 
			performanceLevel: 1, numberOfStudents: notmeet};
			$("#resultsSuccess").addClass("hidden");
			$("#resultsFail").addClass("hidden");
			$.ajax({
				url: "updateResults.php",
				method: "GET", 
				data: requestData,
			})
			.done(function() {
				$("#resultsSuccess").removeClass("hidden");
			});
			requestData = {sectionId : currentSection, major : currentMajor, outcomeId: currentOutcome, 
			performanceLevel: 2, numberOfStudents: meet};
			$("#resultsSuccess").addClass("hidden");
			$("#resultsFail").addClass("hidden");
			$.ajax({
				url: "updateResults.php",
				method: "GET", 
				data: requestData,
			})
			.done(function() {
				$("#resultsSuccess").removeClass("hidden");
			});
			var requestData = {sectionId : currentSection, major : currentMajor, outcomeId: currentOutcome, 
			performanceLevel: 3, numberOfStudents: exceed};
			$("#resultsSuccess").addClass("hidden");
			$("#resultsFail").addClass("hidden");
			$.ajax({
				url: "updateResults.php",
				method: "GET", 
				data: requestData,
			})
			.done(function() {
				$("#resultsSuccess").removeClass("hidden");
			});
		}
		change1 = 0;
		}
		$("#saveResults").click(resultsave);

		function newassessment() {
			var tag;
			var temp;
			tag = "weight" + numAssessments;
			temp = '<input class = "num" type = "number" id = ' + tag + ' min = "0" max = "100" required>';
			$(".grid3").append(temp);
			tag = "#" + tag;
			$(tag).on('change', assessmentChange);
			tag = "assessment" + numAssessments;
			temp = '<textarea class = "num" id = ' + tag + ' rows = "2" maxlength = "400"></textarea>';
			$(".grid3").append(temp);
			tag = "#" + tag;
			$(tag).on('change', assessmentChange);
			tag = "trash" + numAssessments;
			temp = '<img class = "trash" id = ' + tag + ' src = "trash.svg" name = "3" alt = "remove">';
			$(".grid3").append(temp);
			tag = "#" + tag;
			$(tag).click(trashman);
			assessments.push(numAssessments);
			assessments.push(-1);
			numAssessments++;
		}
		$("#newAssessment").click(newassessment);
	

		function saveassess() {
			var i;
			var query;
			var weightsToAdd = [];
			var descsToAdd = [];
			var temp;
			var ids = [];
			var idindexes = [];
			var requestData;
			var error = 0;
			var weightTotal = 0;
			$("#assessmentsSuccess").addClass("hidden");
			$("#assessmentsFail").addClass("hidden");
			$("#weightsNot100").addClass("hidden");
			for(i = 0; i < $(".grid3 input").length; i++)
			{
				query = ".grid3 input:eq(" + i + ")";
				temp = $(query).attr('id');
				temp = temp.substr(6);
				idindexes.push(parseInt(temp)*2-1);
				temp = assessments[parseInt(temp)*2-1];
				if($(query).val() == "")
				{
					error = 1;
				}
				else {
					weightsToAdd.push($(query).val());
					weightTotal += parseInt($(query).val());
					ids.push(temp);
				}
				query = ".grid3 textarea:eq(" + i + ")";
				if($(query).val() == "") error = 1;
				else descsToAdd.push($(query).val());
			}
			if(error == 1) 
			{
				$("#assessmentsFail").removeClass("hidden");
			}
			else if(weightTotal != 100)
			{
				console.log("Weights not 100!");
				$("#weightsNot100").removeClass("hidden");
			}
			else
			{
				change2 = 0;
				for(i = 0; i < ids.length; i++)
				{
					if(ids[i] != -1) {
						requestData = {
							assessmentId: ids[i],
							sectionId: currentSection,
							outcomeId: currentOutcome,
							major: currentMajor,
							weight: weightsToAdd[i],
							assessmentDescription: descsToAdd[i],
						};
						$.ajax({
							url: "updateAssessment.php",
							method: "GET", 
							data: requestData,
						})
						.done(function() {
							console.log("We updated something.");
						});
					}
					else {
						requestData = {
							sectionId: currentSection,
							outcomeId: currentOutcome,
							major: currentMajor,
							weight: weightsToAdd[i],
							assessmentDescription: descsToAdd[i],
						};
						$.ajax({
							url: "updateAssessment.php",
							method: "GET", 
							data: requestData,
						})
						.done(function() {
							console.log("We added something.");
						});
					}
				}
				for(i = 0; i < assessmentsToDelete.length; i++)
				{
					if(assessmentsToDelete[i] != -1)
					{
						requestData = {assessmentId : assessmentsToDelete[i]};
						$.ajax({
							url: "deleteAssessment.php",
							method: "GET", 
							data: requestData,
						})
						.done(function() {
							console.log("Item deleted.");
						});
					}
				}
			}
			
		}
		$("#saveAssessments").click(saveassess);

		function narrativeChange() {
			console.log("Narrative changed!");
			change3 = 1;
		}
		$('.num2').on('change', narrativeChange);

		function savenarrative() {	
			var strengths = $("#strengths").val();
			var weak = $("#weaknesses").val();
			var acts = $("#actions").val();
			$("#narrativeSuccess").addClass("hidden");
			$("#narrativeFail").addClass("hidden");
			if(strengths == "" || strengths == "None" ||
			weak=="" || weak == "None")
			{
				$("#narrativeFail").removeClass("hidden");
			}
			else {
				change3 = 0;
				var requestData = {
					sectionId: currentSection,
					major: currentMajor,
					outcomeId: currentOutcome,
					strengths: strengths,
					weaknesses: weak,
					actions: acts
				};
				$.ajax({
					url: "updateNarrative.php",
					method: "GET", 
					data: requestData,
				})
				.done(function() {
					console.log("Narratives updated!");
				});
			}
		}
		$("#saveNarrative").click(savenarrative);
		function window() {
			if(change1 + change2 + change3 != 0) alert("CHANGES NOT SAVED");
		}
		$(window).on('beforeunload', window);

		function pwordsubmit() {
			var p1;
			var p2;
			var requestData;
			
			p1 = $("#newPassword").val();
			p2 = $("#confirmPassword").val();
			$("#passwordError").addClass("hidden");
			$("#passwordSucceeded").addClass("hidden");
			if(p1 == "" || p2 == "" || p1 != p2)
			{
				console.log("Error");
				$("#passwordError").removeClass("hidden");
			}
			else {
				$("#passwordSucceeded").removeClass("hidden");
				requestData = {password: p1,
				email: instructorEmail};
				$.ajax({
					url: "updatePassword.php",
					method: "GET", 
					data: requestData,
				})
				.done(function() {
					console.log("Password updated!");
				});

			}
		}
		$("#submitPassword").click(pwordsubmit);


	
$("#userMenu").click(myFunction);
});
