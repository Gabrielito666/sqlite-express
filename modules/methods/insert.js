const signs = require( '../submodules/signos' );
const is = require( '../submodules/is' );
const consoleQuery = require( '../submodules/consoleQuery' );
module.exports = ( { db, table, row, logQuery } ) => {

    return new Promise( ( resolve, reject ) => {
        let cols = Object.keys( row );
        let values = Object.values( row );
        values.forEach( ( value, index ) => {
            if ( is.o( value ) ) values[ index ] = JSON.stringify( value );
            if ( is.b( value ) ) values[ index ] = value.toString();
        });
        let finalQuery = `INSERT INTO ${ table }(${ cols.join( ', ' ) }) VALUES(${ signs( values.length ) })`;
        if( logQuery ) consoleQuery( finalQuery, values );
        db.run( finalQuery, values, function( err ) {
            if ( err ) {
                reject( err );
            } else {
                if( logQuery ) console.log( 'Row inserted successfully.' );
                resolve(this.changes === 1);
            }
        });
    });
};
