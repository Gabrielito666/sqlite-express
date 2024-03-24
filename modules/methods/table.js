const consoleQuery = require( '../submodules/consoleQuery' );
module.exports = ( { db, table, columns, logQuery } ) => {

  return new Promise( ( resolve, reject )=>{
    let stringColumns = Object.entries( columns ).map( col => `${ col[ 0 ] } ${ col[ 1 ] }` ).join( ', ' );
    let finalQuery = `CREATE TABLE IF NOT EXISTS ${ table } (${ stringColumns })`;
    if( logQuery ) consoleQuery( finalQuery );
    db.run( finalQuery, function( err ) {
      if ( err ) {
        console.error( err.message );
        reject( err );
        return;
      }
      if ( logQuery ) console.log( `Checked table '${ table }'. Created if it did not exist.` );
      resolve()
    } );
  } );
};