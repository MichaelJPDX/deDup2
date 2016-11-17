/******  Record layout
"_id",
"email",
"firstName",
"lastName",
"address",
"entryDate"
*********************/


/****************************
** Some setup stuff
****************************/
var inputFile = "leads.json";
var outputFile = "qualifiedLeads.json";
var logFile = "changeLog.txt";
/***************************/
var fs = require("fs");
var ForerunnerDB = require("forerunnerdb");

// Create an object for logging stuff
var Logger = new Object();
Logger.fsHandle = fs.openSync(logFile, 'a');
Logger.message = function(oString) {
	//  Prepend output with date/time
	var d = new Date();
	//  Docs say I should be able to put the fsHandle in here, but computer says no
	fs.appendFileSync(logFile, d.toISOString() + ": " + oString + "\n"); 
};
Logger.message("Processor START");

// Read in the DB using loki
var frdb = new ForerunnerDB();
var db = frdb.db('myleads');

// Add a collection to the database
var qLeads = db.collection('qualifiedLeads');

// Read and parse input file
var inFileContent = fs.readFileSync(inputFile);
var jsonContent = JSON.parse(inFileContent);
var leads = jsonContent.leads;

//  Output object and data set
var jsonOutput = new Object;
var myLeads = new Array();

//  loop through raw data and bang it into a collection
for(var exKey in leads) {
	qLeads.insert(leads[exKey]);
	Logger.message("Input record, id: " + leads[exKey]._id + " email: " + leads[exKey].email);
}
	
// Create arrays to hold index values (id and email)
var usedID = new Array();
var usedEmail = new Array();
	
// Now, sort the records in descending date order
var results = qLeads.find({}, { 
	$orderBy: { 
		entryDate: -1  // descending date order
	}
});
for (var i = 0; i < results.length; i++) {
	var currentID = results[i]._id;
	var currentEmail = results[i].email;
	if (usedID.indexOf(currentID) < 0 && usedEmail.indexOf(currentEmail) < 0) {
		// Neither of the index values have been used, 
		// push them on to the used array
		usedID.push(currentID);
		usedEmail.push(currentEmail);
		
		// And push the record onto the output Array
		myLeads.push(results[i]);
		Logger.message("Output record, id: " + results[i]._id + " email: " + results[i].email);
	}
}
// Now myLeads should just have the unique records, so just output it.
jsonOutput.leads = myLeads;
//var oFile = fs.openSync(outputFile, 'w');
fs.writeFileSync(outputFile, JSON.stringify(jsonOutput));
//fs.closeSync(oFile);


