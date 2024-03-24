const consoleQuery = require( '../submodules/consoleQuery' );
const whereConstructor = require( '../submodules/where' );
module.exports = ( { db, table, where, connector, logQuery } ) => {

    return new Promise( ( resolve, reject ) => {
        const conditionalSentence = 'SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END FROM';
        const finalQuery = `${ conditionalSentence } ${ table } ${ whereConstructor.query(where, connector) }`
        const placeHolders = whereConstructor.placeHolders(where);
        if( logQuery ) consoleQuery( finalQuery, placeHolders );
        db.get( finalQuery, placeHolders, function( err, exist ) {
            if ( err ) {
                reject( err );
            } else {
                if( logQuery ) console.log( 'Existence verification performed.' );
                resolve(exist['CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END'] === 1);
            }
        });
    });
};