const whereConstructor = require( './submodules/where' );
const is = require( './submodules/is' );
const consoleQuery = require( './submodules/consoleQuery' );
const processResult = require( './submodules/processResult' );
module.exports = async ( { db, table, select, where, connector, processColumns, processRows, emptyResult, logQuery } ) => {

  select = is.a( select ) ? select.join( ', ' ) : select;
  return await new Promise( ( resolve, reject ) => {
    let finalQuery = `SELECT ${ select } FROM ${ table } ${ whereConstructor.query( where, connector ) }`;
    let placeHolders = whereConstructor.placeHolders( where );
    if ( logQuery ) consoleQuery( finalQuery, placeHolders );
    db.all( finalQuery, placeHolders, function( err, rows ) {
      if( err ){
        reject( err );
      }else{
        resolve(
          ( processColumns || processRows ) ? processResult( rows, processColumns, processRows, emptyResult ) : rows
        );
      };                            
    } );
  } );
};
