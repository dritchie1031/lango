// Globals
let sqlite3 = require("sqlite3").verbose();  // use sqlite
let fs = require("fs");

let dbFileName = "FlashCards.db";
// makes the object that represents the database in our code
let db = new sqlite3.Database(dbFileName);

// Initialize table.
// If the table already exists, causes an error.
let cmdStr = "CREATE TABLE flashcards (user TEXT, english TEXT, spanish TEXT, seen INT, correct INT);";

let cmdStr2 = "CREATE TABLE users (google_id TEXT PRIMARY KEY, first TEXT, last TEXT);";
db.run(cmdStr, tableCreationCallback1);

// Always use the callback for database operations and print out any
// error messages you get.
function tableCreationCallback1(err) {
  if (err) {
	  console.log("Table creation error",err);
  } else {
	  console.log("Database created");
	  db.run(cmdStr2, tableCreationCallback2);
  }
}

function tableCreationCallback2(err) {
 if (err) {
	  console.log("Table creation error",err);
  } else {
	  console.log("Database created");
	  db.close();
  } 
}
