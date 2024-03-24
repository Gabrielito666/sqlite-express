const consoleQuery = require( '../submodules/consoleQuery' );
const is = require( '../submodules/is' );
const whereConstructor = require( '../submodules/where' );
module.exports = ( { db, table, where, connector, logQuery } ) => {

  return new Promise( ( resolve, reject ) => {
    let finalQuery = `DELETE FROM ${ table } ${ whereConstructor.query( where, connector ) }`;
    let placeHolders = whereConstructor.placeHolders( where, connector );
    if( logQuery ) consoleQuery(finalQuery, placeHolders);
    db.run( finalQuery, placeHolders, function ( err ) {
      if ( err ) {
        console.error( err )
        reject( err );
      }else{
        resolve(this.changes);}
    });
  });
};