const http = require( "http" );
const fs = require( 'fs' );
const configFile = "./config.json";
var server;
// read some user settings from config file
var config;
const debug = true;
function logConsole( sev, data ) {
  if( debug == true ) {
    console.log( "SEV" + sev + ":\n" + data );
  }
}

function requestListener( req, res ) {
  // check the reqest. we decide what to do based on that
  url = req.url;
  logConsole( 0, "reading file: " + url );
  // serve the index.html file in server directory
  fs.readFile( config.htmlDir + url, function serverHtmlFile( err, data ) {
    if( err ) {
      // tell user about it
      res.setHeader( 'Content-Type', 'text/html' );
      res.write( "something went wrong with reading this path" );
      res.end();
      logConsole( 0, "error reading");
      throw err;
    } else {
      // everything is alright
      var dotoffset = req.url.lastIndexOf( '.' );
            var mimeType = dotoffset == -1
                            ? 'text/plain'
                            : {
                                '.html' : 'text/html',
                                '.ico' : 'image/x-icon',
                                '.jpg' : 'image/jpeg',
                                '.png' : 'image/png',
                                '.gif' : 'image/gif',
                                '.css' : 'text/css',
                                '.js' : 'text/javascript'
                                }[ req.url.substr( dotoffset ) ];
      res.setHeader( 'Content-Type', mimeType );
      res.write( data );
      res.end();
    }
  } );
}

function createServer() {
  return http.createServer( requestListener );
}

function processFile( err, data ) {
  if( err ) {
    throw err;
  }
  config = JSON.parse( data );
  logConsole( 0, config.host );
  logConsole( 0, config.port );
  // now we can progress further
  server = createServer();
  server.listen( config.port );
}
fs.readFile( configFile, processFile );

/*
const config = JSON.parse( fs.readFile( configFile ), ( err, data ) => {
  if( err ) {
    throw err;
  }
  // read it and init vars
  return data;
} );
*/
