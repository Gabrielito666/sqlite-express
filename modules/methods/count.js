const consoleQuery = require( '../submodules/consoleQuery' );
const whereConstructor = require( '../submodules/where' );
module.exports = ( { db, table, where, connector, logQuery } ) => {

    return new Promise( ( resolve, reject ) => {
        const finalQuery = `SELECT COUNT(*) FROM ${ table } ${ whereConstructor.query(where, connector) }`;
        const placeHolders = whereConstructor.placeHolders(where);
        if( logQuery ) consoleQuery( finalQuery, placeHolders );
        db.get( finalQuery, placeHolders, function( err, count ) {
            if ( err ) {
                reject( err );
            } else {
                if( logQuery ) console.log( 'Existence verification performed.' );
                resolve(count['COUNT(*)']);
            }
        });
    });
};