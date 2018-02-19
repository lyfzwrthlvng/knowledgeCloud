const http        = require( 'http' );
const fs          = require( 'fs' );
const qs          = require( 'querystring' );
const mongoClient = require( 'mongodb' ).MongoClient;

const configFile  = "./config.json";
const debug       = 9;

var server;
var database = 0;
var config;

function logConsole( sev, data ) {
  if( sev < debug ) {
    console.log( "SEV" + sev + ":\n" + data );
  }
}

function requestListener( req, res ) {
  // check the reqest. we decide what to do based on that
  url = req.url;
  logConsole( 1, "reading file: " + url );
  // the url for post data is /postdata, handle that specially
  var msgBody = '';
  if( url.indexOf( 'postdata' ) != -1 ) {
    // TODO:
    // Eventually, this should be decided on the fly, per user at random
    // per connection. We don't want all users to bombard one url
    req.on( 'data', function( data ) {
      msgBody += data;
    } );
    req.on( 'end', function() {
      var postdata = JSON.parse( msgBody );
      // TODO: this is very naive, needs some randomization
      logConsole( 2, postdata.ss + " from user " + postdata.uname );
      // for now, just use msgBody
      // TODO search in db
      if( database == 0 ) {
        logConsole( 0, "We haven't init the db yet" );
      } else {
        logConsole( 2, "Good to go" );
        //database.close();
        // we open it again in the next file
        dba.handleRequest( config, database, postdata, "search" );
      }
    });
    //logConsole( 1, "req " + req.method );
  } else { // a file, not a post request
  // serve the index.html file in server directory
  fs.readFile( config.htmlDir + url, function serverHtmlFile( err, data ) {
    if( err ) {
      // tell user about it
      res.setHeader( 'Content-Type', 'text/html' );
      res.write( "something went wrong with reading this path" );
      res.end();
      logConsole( 0, "error reading " + url );
      //throw err; don't want the server to die
    } else {
      // everything is alright
      var dotoffset = req.url.lastIndexOf( '.' );
      logConsole( 0,  dotoffset );
            var mimeType = dotoffset == -1
                            ? 'text/plain'
                            : {
                                '.html' : 'text/html',
                                '.ico' : 'image/x-icon',
                                '.jpg' : 'image/jpeg',
                                '.png' : 'image/png',
                                '.gif' : 'image/gif',
                                '.css' : 'text/css',
                                '.js' : 'text/javascript',
                                '.map' : 'application/octet-stream'
                                }[ req.url.substr( dotoffset ) ];
      res.setHeader( 'Content-Type', mimeType );
      res.write( data );
      res.end();
    }
  } );
} // end of if ( postrequest / file )
}

function createServer() {
  return http.createServer( requestListener );
}

function initMongoDb() {
  url = config.mongoUrl;
  mongoClient.connect( url, function( err, db ) {
    if ( err ) {
      throw err;
    }
    logConsole( 2, "Connected to DB" );
    database = db;
  });
}

function processFile( err, data ) {
  if( err ) {
    throw err;
  }
  config = JSON.parse( data );
  logConsole( 0, config.host );
  logConsole( 0, config.port );
  // now we can progress further
  // step #2. Init mongoDB
  initMongoDb();
  server = createServer();
  server.listen( config.port );
}
// the below function is the entry point for the server
function startServerOperation() {
  fs.readFile( configFile, processFile );
}
startServerOperation();
