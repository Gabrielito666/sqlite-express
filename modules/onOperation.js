const db = require('./db');
const processParams = require( './processParams' );
module.exports = ( { method, parameters, context } ) => {

    return new Promise( ( resolve, reject ) => {
        parameters = processParams( method, parameters, context._defaultOptions );
        let dbKey = parameters.db;
        parameters.db = context._dataBasesList[ dbKey ].db;

        if( Object.keys( context._dataBasesList ).includes( dbKey ) ){
            context._dataBasesList[ dbKey ].addOperation( {
                method : method,
                parameters : parameters,
                resolve : resolve,
                reject : reject
            } );
        }else{
            reject( new Error( 'The database you have entered is not defined' ) );
        }
    });
}   