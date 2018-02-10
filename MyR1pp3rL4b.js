/*
  File: MyR1pp3rL4b.js
  Created by: Gh0stByte
  Date: 2/10/2018

  Ripper for MyProgrammingLab by Pearson.
  Export questions and answers as a CSV or to Quizlet
*/
r = {
  CurrentRipElem: "", // The name of the chapter/stuff we're ripping for use use in the save file
  Q_SEPERATE_TERM: "^^^", // Term delimiter for quizlet  
  Q_SEPERATE_DEFF: "~~~", // Deff delimiter for quizlet
	prevSubmissions: {}, // A dictionary with exSSNs as a key and an array or previous submissions as the value
  instructions: {}, // An array of Exercises

  /* So to access these variables in the callback functions, we need to use setters and getters */
  setSubmissions: function(s) {
    this.prevSubmissions = s;
  },
  getSubmissions: function() {
    return this.prevSubmissions;
  },
  addSubmission: function(k, s) {
    this.prevSubmissions[k] = s;
  },
  setInstructions: function(i) {
    this.instructions = i;
  },
  addInstruction: function(k, i) {
    this.instructions[k] = i;
  },
  getInstructions: function() {
    return this.instructions;
  },
  /**
    Grab the exSSNs from the the chapter/section the user inputs
  */
	getexSSNs: function() {
    // Get initial input
  	var a = prompt("Please enter the chapter or subsection number you want to rip. eg. 10.3");

  	try
  	{
      // Make sure they input a number
      while(!parseFloat(a) && !isNaN(a)) { // Check if it's a number
        a = prompt("Input Error: You must enter the number of the chapter");
      }
    
  		if(a % 1 == 0) // If it's a section number
      {
        this.CurrentRipElem = "Chapter_" + a;
				return getExSSNsFromNode($('[name^=\"Chapter '+ parseInt(a) +' \"]').find("ul")); // Get it by chapter
      }
    	else // Otherwise it's a chapter
      {
        this.CurrentRipElem = "Chapter_" + Math.floor(a) + "_Section_" + Math.round((a - Math.floor(a))*10);
    		return getExSSNsFromNode($('[name^=\"'+ parseFloat(a) +' \"]').find("ul")); // Grab it by the section
      }
  	} catch(e) {
  		alert(e.message);
  	}
  },

  /**
    Get dictionary of Submissions from our exSSNs
    TODO: Get only the correct ones - and remove all incorrect ones from both dicts
    */
  getSubmissionsFromExSSNs: function(exs, callback) {
    TCAPI.getPreviousSubmissions({
        async:false, // We don't want our other functions to execute before this is done, cause we need it
        args: {exSSNs: exs, actingAsEmail: ""},  // Don't need an actingAsEmail
        callback: function(data) { 
          /*
          try{
          for(var k in data) 
            if(data[k][data[k].length-1].isCorrect) 
              r.addSubmission(k, [data[k].length-1]);
          } catch(e) { console.log("Nothing here"); }
          */
          // Set the submissions dict
          // Iterate through these and remove all without correct
          r.setSubmissions(data);
        } 
    });
  },

  /**
    Get dictionary of the instructions from our exSSNs
    */
  getInstructionsFromExSSNs: function(exs) {
    r.setInstructions = {}; // Clear out whatever's in there
    TCAPI.getInstructions({ // Grab instructions
      args: {
        exSSNs: exs // For each of our exSSNs
      },
      callback: function (xml) { 
        $(xml).find('Exercise').each(function () { // For each of the exercises
          // Add a cleaned up instruction. Remove html tags
          r.addInstruction($(this).attr("SSN"), $(this).text().replace(/<\s*br[^>]?>/,'').replace(/(<([^>]+)>)/g, ""));
        });
      }
    });
  },

  /**
    Remove a bunch of stuff from the correct answers
    */
  parseAnswer: function(ans, mode) {
    return ans.replace(/currentPage=\d+-\d+/g, "").replace(/(::::c\d=)/, "").replace(/(::::c\disCorrect=true)/, "").replace("::::", "").replace(/c\d\=/, ", ").replace(/c\disCorrect=true::::/g, "").replace("::::", "");
 },
  /**
    Remove escape characters and replace all " with "" for CSV compatibility
    */
  parseForCSV: function(q) {
    return q.replace(/(\r\n|\n|\r|\s+|\t|&nbsp;)/gm,' ').replace(/"/gm, '""');
  },

  /** 
    Rip answers to a CSV file
    */
  ripToCSV: function() {
    let submission; // The submission we're gonna be working with

    // Set CSV header
    let csvContent = "data:text/csv;charset=utf-8,\nQuestion, Answer\n";

    // For each of the questions
    for(var key in this.getSubmissions()) {
      try { // Check if there is a submission
        submission = this.prevSubmissions[key]; // Previous submissions array
        // Add the question and answer to the CSV
        csvContent += '"' + r.parseForCSV(this.instructions[key]) + '","' + r.parseForCSV(r.parseAnswer(submission[submission.length-1]["submissionText"])) + '"\r\n'; 
      } catch(e) {
        if(typeof e === 'TypeError') {
          console.log("No submissions found for this problem!");
        } else {
          console.log(typeof e);
        }
      }
    }

    // Download the file
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a"); // Placeholder we need
    link.setAttribute("href", encodedUri); // Set the link to the fileUri
    link.setAttribute("download", "MPL_" + this.CurrentRipElem +".csv"); // Set the name
    document.body.appendChild(link); // Required for FF
    link.click(); // Download the file
  },

  /**
    Rip for quizlet import
    */
  ripForQuizlet : function() {
    $("#QZTxt").val(""); // Clear out any old stuff
    let submission; // Submission we're working with
    // For each of the questions
    for(var key in this.getSubmissions()) {
      try {
        submission = this.prevSubmissions[key]; // Previous submissions array
        // Add the question to the textbox so we can copy it later. 
        $("#QZTxt").val($('#QZTxt').val() +  this.instructions[key].replace(/\n\n/g, "\n").replace(/\t\t/g, "\t") + this.Q_SEPERATE_TERM + r.parseAnswer(submission[submission.length-1]["submissionText"], 1) + this.Q_SEPERATE_DEFF); 
      } catch(e) {
        if(typeof e === 'TypeError') {
          console.log("No submissions found for this problem!");
        } else {
          console.log(typeof e);
        }
      }
    }
    // Show the div with the text
    $("#ripper").show();
  },

  /**
    General rip function
    */
  rip: function(mode) {
    console.log("Start ripping...");
    var ssns = r.getexSSNs(); // Grab the ssns

    console.log("Getting instructions...");
    this.getInstructionsFromExSSNs(ssns); // Set the instructions

    console.log("Getting submissions...");
    this.getSubmissionsFromExSSNs(ssns); // Set the submissions

    // Switch which type we want to rip
    switch(mode) {
      case 0: // If it's quizlet 
        this.ripForQuizlet();
        break;
      case 1: // If it's to CSV
        this.ripToCSV();
        break;
      default: // If it's something else
        console.log("Something went wrong..");
        break;
    }
  },

  /**
    Copy the content of our textarea
    */
  copyText: function() {
     $("#QZTxt").select(); // Select everything in it
      document.execCommand('copy'); // Copy it
      $("#QZTxt").prop("selected", false); // Deselect
      alert("Copied to clipboard. Import into Quizlet and separate with " + this.Q_SEPERATE_TERM + " and " + this.Q_SEPERATE_DEFF);
  },
  /**
    Toggle the ripper div
    */
  toggleTextArea: function() {
    $("#ripper").toggle();
  },
  /**
    Setup the UI for the ripper
    */
  setupUI: function() {
    // Create the ripper textarea and buttons
    $("#nav-dropdown").before("<div id=ripper><textarea style=\"display:block;width:100%;\" id=QZTxt></textarea><button style=\"display:inline-block;\" onClick=r.toggleTextArea()>Hide</button><button style=\"display:inline-block;\" onClick=r.copyText()>Copy</button><button style=\"display:inline-block;\" onClick=r.rip(0)>Rip Another</button></div>"); $("#ripper").hide();
  	// Create the buttons in the dropdown menu
    $("#labTable").find(".dropdown").find("ul").find("li").find("ul").append('<li><a class="bold">Ripper:</a></li><li><a href="#" onclick="r.rip(1);">&nbsp;&nbsp;&nbsp;•&nbsp;Rip to CSV</a></li><li><a href="#" onclick="r.rip(0);">&nbsp;&nbsp;&nbsp;•&nbsp;Rip for Quizlet</a></li><li><a class="italic" href="#" onclick="r.toggleTextArea();">&nbsp;&nbsp;&nbsp;•&nbsp;Toggle textbox</a></li>');
  }
}; r.setupUI(); // Setup the UI