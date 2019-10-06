/*
 *  USAGE
 *  --Translate Request--
 *  Make an AJAX request to url "translate?english=english phrase here"
 *  The response will be JSON, in the format:
 *  {
 *    "English": *original english text*,
 *    "Spanish": *translated text*
 *  }
 *
 *  You can test this by going directly to the translate URL. It would look like this:
 *  "http://server162.site:your-port-number/translate?english=english phrase here"
 *
 *  --Database Store Request--
 *  Make an AJAX request to url "store?english=example phrase&spanish=translated text"
 *  If it works, 'Insert operation successful' will be printed to the console (on the server, not 
 *  the browser)
 */
const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');

const GoogleStrategy = require('passport-google-oauth20');
const sqlite = require('sqlite3');

const googleTrans = require('googleAPICall.js');

const port = 57019;

const dbFileName = "FlashCards.db";
const db = new sqlite.Database(dbFileName);

function translateQueryHandler(req, res, next) {
  let url = req.url;
  let qObj = req.query;
  
  function giveResponse(spanishText) {
    res.json({"English":qObj.english,"Spanish":spanishText});
  }

  console.log(qObj);
  if (qObj.english != undefined) {
	  googleTrans.translate(qObj.english, giveResponse);
  }
  else {
	  next();
  }
}

function addToDBHandler(req, res, next) {
  let qObj = req.query;

  function insertCallback(err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Insert operation successful');
    }
    res.send();
  }

  if (qObj.english == undefined || qObj.spanish == undefined) {
    next();
  }
  else {
    let cmdStr = 'INSERT into flashcards (user, english, spanish, seen, correct) VALUES(@0,@1,@2,0,0);';
    db.run(cmdStr, req.user.userID, qObj.english, qObj.spanish, insertCallback); 
  }
}

function getFlashCardHandler(req, res, next) {
  let userID = req.user.userID;

  function selectCallback(err, rows) {
    if (err) {
      console.log(err);
      res.send();
    }
    else {
      console.log(rows);
      res.json(rows);
    }
  }

  let cmdStr = 'SELECT * FROM flashcards WHERE user=@0';
  db.all(cmdStr, userID, selectCallback);
}

function getUserNameHandler(req, res, next) {
  let url = req.url;
  let user = req.user;
  function selectCallback(err, row) {
    if (err) {
      console.log(err);
      res.send();
    }
    else {
      res.json({"first": row.first});
    }
  }

  let cmdStr = 'SELECT * FROM users WHERE google_id=@0';
  db.get(cmdStr, req.user.userID, selectCallback);

}

function incSeenHandler(req, res, next) {
  let qObj = req.query;
  let isCorrect = qObj.correct === "true";
  if (qObj.english == undefined) {
    next();
  }
  function selectCallback(err, row) {
    let newSeen = row.seen + 1;
    let newCorrect = row.correct;
    if (isCorrect) {
      newCorrect++;
    }
    let updateCmdStr = "UPDATE flashcards SET seen=@0, correct=@1 WHERE user=@2 AND english=@3;";
    db.run(updateCmdStr, newSeen, newCorrect, req.user.userID, qObj.english, updateCallback);
  }
  function updateCallback(err) {
    console.log("Update successful");
    res.send();
  }

  let selectCmdStr = "SELECT * FROM flashcards WHERE user=@0 AND english=@1;";
  db.get(selectCmdStr, req.user.userID, qObj.english, selectCallback);

}

// Google login credentials, used when the user contacts
// Google, to tell them where he is trying to login to, and show
// that this domain is registered for this service. 
// Google will respond with a key we can use to retrieve profile
// information, packed into a redirect response that redirects to
// server162.site:[port]/auth/redirect
const googleLoginData = {
    clientID: /* Removed for security reasons */,
    clientSecret: /* Removed for security reasons */,
    callbackURL: /* Removed for security reasons */
};



// Strategy configuration. 
// Tell passport we will be using login with Google, and
// give it our data for registering us with Google.
// The gotProfile callback is for the server's HTTPS request
// to Google for the user's profile information.
// It will get used much later in the pipeline. 
passport.use( new GoogleStrategy(googleLoginData, gotProfile) );


// Let's build a server pipeline!

// app is the object that implements the express server
const app = express();

// pipeline stage that just echos url, for debugging
app.use('/', printURL);

// Check validity of cookies at the beginning of pipeline
// Will get cookies out of request, decrypt and check if 
// session is still going on. 
app.use(cookieSession({
    maxAge: 6 * 60 * 60 * 1000, // Six hours in milliseconds
    // meaningless random string used by encryption
    keys: [/* Removed for security reasons */]  
}));

// Initializes request object for further handling by passport
app.use(passport.initialize()); 

// If there is a valid cookie, will call deserializeUser()
app.use(passport.session()); 

// Public static files
app.get('/*',express.static('public'));

// next, handler for url that starts login with Google.
// The app (in public/login.html) redirects to here (not an AJAX request!)
// Kicks off login process by telling Browser to redirect to
// Google. The object { scope: ['profile'] } says to ask Google
// for their user profile information.
app.get('/auth/google',
	passport.authenticate('google',{ scope: ['profile'] }) );
// passport.authenticate sends off the 302 response
// with fancy redirect URL containing request for profile, and
// client ID string to identify this app. 

// Google redirects here after user successfully logs in
// This route has three handler functions, one run after the other. 
app.get('/auth/redirect',
	// for educational purposes
	function (req, res, next) {
	    console.log("at auth/redirect");
	    next();
	},
	// This will issue Server's own HTTPS request to Google
	// to access the user's profile information with the 
	// temporary key we got in the request. 
	passport.authenticate('google'),
	// then it will run the "gotProfile" callback function,
	// set up the cookie, call serialize, whose "done" 
	// will come back here to send back the response
	// ...with a cookie in it for the Browser! 
	function (req, res) {
	    console.log('Logged in and using cookies!')
	    res.redirect('/user/lango.html');
	});

// static files in /user are only available after login
app.get('/user/*',
	isAuthenticated, // only pass on to following function if
	// user is logged in 
	// serving files that start with /user from here gets them from ./
	express.static('.') 
       ); 

// next, all queries (like translate or store or get...
app.get('/translate', translateQueryHandler );
app.get('/store', addToDBHandler);
app.get('/getCards', getFlashCardHandler);
app.get('/getUserName', getUserNameHandler);
app.get('/incSeen', incSeenHandler);


// finally, not found...applies to everything
app.use( fileNotFound );

// Pipeline is ready. Start listening!  
app.listen(port, function (){console.log('Listening...');} );


// middleware functions

// print the url of incoming HTTP request
function printURL (req, res, next) {
    console.log(req.url);
    next();
}

// function to check whether user is logged when trying to access
// personal data
function isAuthenticated(req, res, next) {
  if (req.user) {
	  console.log("Req.session:",req.session);
	  console.log("Req.user:",req.user);
	  next();
  } else {
	  res.redirect('/login.html');  // send response telling
	  // Browser to go to login page
  }
}


// function for end of server pipeline
function fileNotFound(req, res) {
    let url = req.url;
    res.type('text/plain');
    res.status(404);
    res.send('Cannot find '+url);
}

// Some functions Passport calls, that we can use to specialize.
// This is where we get to write our own code, not just boilerplate. 
// The callback "done" at the end of each one resumes Passport's
// internal process. 

// function called during login, the second time passport.authenticate
// is called (in /auth/redirect/),
// once we actually have the profile data from Google. 
function gotProfile(accessToken, refreshToken, profile, done) {
  console.log("Google profile\n",profile);
  googleID = profile.id.toString();
  first = profile.name.givenName;
  last = profile.name.familyName;

  function insertCallback(err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("Inserted new user into database");
    }
  }

  function selectCallback(err, row) {
    if (err) {
      console.log(err);
    }
    else {
      if (row) { 
        console.log("Found user"); 
      }
      else {
        let cmdStr = 'INSERT into users (google_id, first, last) VALUES(@0,@1,@2);';
        db.run(cmdStr, googleID, first, last, insertCallback);
      }
    }
  }
  let selectCmdStr = 'SELECT * FROM users WHERE google_id = @0;';
  db.get(selectCmdStr, googleID, selectCallback);

  // here is a good place to check if user is in DB,
  // and to store him in DB if not already there. 
  // Second arg to "done" will be passed into serializeUser,
  // should be key to get user out of database.

  done(null, googleID); 
}

// Part of Server's session set-up.  
// The second operand of "done" becomes the input to deserializeUser
// on every subsequent HTTP request with this session's cookie. 
passport.serializeUser((dbUserID, done) => {
    console.log("SerializeUser. Input is",dbUserID);
    done(null, dbUserID);
});

// Called by passport.session pipeline stage on every HTTP request with
// a current session cookie. 
// Where we should lookup user database info. 
// Whatever we pass in the "done" callback becomes req.user
// and can be used by subsequent middleware.
passport.deserializeUser((dbUserID, done) => {
    console.log("deserializeUser. Input is:", dbUserID);
    // here is a good place to look up user data in database using
    // dbRowID. Put whatever you want into an object. It ends up
    // as the property "user" of the "req" object. 
    let userData = {userID: dbUserID};
    done(null, userData);
});
