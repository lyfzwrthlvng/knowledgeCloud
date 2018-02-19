function handleRequest( config, db, postdata, operation ) {
  uname = postdata.uname;
  if( operation != "search" ) {
    return;
  }
  collection = db.collection( uname + 'Col' );
  
}
