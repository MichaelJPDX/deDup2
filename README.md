# deDup2
Code challenge from Marketo

Author: Michael Holland
Date: November 2016

REQUIRES: forerunnerdb module

Reads a JSON file of "leads" from leads.json, checks for duplicates and consolidates any found according to entryDate
Stores the consolidated records in an output file of similar format

Leads record layout:
"_id",
"email",
"firstName",
"lastName",
"address",
"entryDate"

Run this JS using node, eg:
node deDup.js

Activity is logged to the file changeLog.txt

This is the simplest and most direct implementation of code that, in theory, meets the goals of the challenge. The "key" to understanding this approach is the directive that the most recent records (according to entryDate) are the correct ones. Therefore, the code simply reads all of the records from the input file into a Forerunner collection, sorts them in descending order by entryDate, and transfers the first occurrence of each id/email pair it finds in the results to the output queue, discarding all the rest.

Since the logic simply discards records that are already "older" than the kept ones, there is minimal logging of changes.

Output is written to qualifiedLeads.json