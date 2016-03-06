var express       = require('express');
var path          = require('path');
var favicon       = require('static-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var multer        = require('multer'); // Used to aid in file uploads in forms

//Global Variables
// Master header file for travel log app
DEFS          = require('travel-log/defines/defines.js'); 

cloudinary    = require('cloudinary'); // Global Handle for image server
dbConnectMongo = null;
connection_string = null;
passport      = require('passport'); // Authentication
dbConfig      = require(DEFS.DIR.DB_CONFIG);
socialConfig  = require(DEFS.DIR.SOCIAL_CONFIG); // Load the social config
SCUBE_LOG     = require(DEFS.DIR.LOGGER); //Global logger object
SCUBE_LOG     = new SCUBE_LOG();
jsonUtil      = require(DEFS.DIR.JSON_UTIL);  // Global Json Library Utility
jsonUtil      = new jsonUtil();
jsonBuilder   = require(DEFS.DIR.JSON_BUILDER);  // Global Json Library Utility
jBuilder      = new jsonBuilder();



// Mongo DB Config 
dbServer = 'openshift_mongo'
config = dbConfig['openshift_mongo'];
config = config.mongolab;
connection_string = 'mongodb://' +config.username + ":" +
                          config.password + "@" +
                          config.host  + ':' +
                          config.port + '/' +
                          config.database;
                          
// App config for image server 
cloudinary.config({ 
  cloud_name: 'dlqznqkpv', 
  api_key: '283962699431494', 
  api_secret: '---TFXOQ4S0-jH8V-hnEn0ceJlw' 
});


// Global Domain handling utility
domainHandler = require(DEFS.DIR.DOMAIN_HANDLER);
domainHandler = new domainHandler();

// Global Data Parser handling utility
dataParser    = require(DEFS.DIR.DATA_PARSER);
dataParser    = new dataParser();

/* Need to research if its a good practice to do this*/
var flash     = require('connect-flash');

var session   = require('express-session'); // Passport session

var app = express();

// View engine setup
app.set('view engine', 'jade');

// Setup application
app.use(favicon());
app.use(logger('dev'));             // log every request to the console
app.use(bodyParser.json());         // get information from html forms
app.use(bodyParser.urlencoded());
app.use(cookieParser());            // read cookies (needed for auth)
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({ dest: './public/temp/' }));

// Set up ejs for templating
app.set('view engine', 'ejs');

// Location to look for static assets
app.use(express.static(__dirname + '/public'));

// Set up port for application to run
app.set('port', process.env.PORT || 3000);

// Required for passport
app.use(session({ secret: 'scubersrockandtheykeeprocking' })); // session secret
app.use(passport.initialize());
app.use(passport.session());                                    // persistent login sessions
app.use(flash());                                               // use connect-flash for flash messages stored in session

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

// This determines the app environment
DEFS.CONST.DOMAIN     = (process.env.OPENSHIFT_NODEJS_PORT) ? DEFS.CONST.PRODUCTION : DEFS.CONST.LOCALHOST;
DEFS.CONST.DOMAIN_URL = (process.env.OPENSHIFT_NODEJS_PORT) ? DEFS.CONST.PRODUCTION_URL : DEFS.CONST.LOCALHOST_URL;


// Launch Scube
var server = app.listen(server_port, server_ip_address, function () {
  console.log('Scube is scubing at IP : ' + server_ip_address + " Port : " + server_port );
});

// Routes For Consumer App
var login = require(DEFS.DIR.R_LOGIN);
var user  = require(DEFS.DIR.R_USER);
var apis  = require(DEFS.DIR.R_APIS);

app.use(login);
app.use(user);
app.use(apis);

// Operating system
var os = require('os');
console.log('NodeJs : Hostname : '+os.hostname()+' OS-Type : '+os.type());

module.exports = app;
