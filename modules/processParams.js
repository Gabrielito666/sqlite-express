const is = require( './submodules/is' );

module.exports = ( method, params, defaults ) => {

    const paramsMethodStructure = {
        createDB : [ 'route', 'key', 'logQuery' ],
        createTable : [ 'db', 'table', 'columns', 'logQuery' ],
        insert : [ 'db', 'table', 'row', 'logQuery' ],
        select : [ 'db', 'table', 'select', 'where', 'connector', 'processColumns', 'processRows', 'emptyResult', 'logQuery' ],
        update : [ 'db', 'table', 'update', 'where', 'connector', 'logQuery' ],
        delete : [ 'db', 'table', 'where', 'connector', 'logQuery' ]
    };
    let [ methodDefaults, correctParams ] = [ {}, {} ];
    paramsMethodStructure[ method ].forEach( p => methodDefaults[ p ] = defaults[ p ] );

    if( is.o( params[ 0 ] ) ) correctParams = params[ 0 ]; //if the first param is an obcject this are the params
    else Object.keys( methodDefaults ).forEach( ( p, i ) => correctParams[ p ] = params[ i ] ); //else construct the object

    const finalParams = {};
    for (const key of Object.keys(methodDefaults)) {
        finalParams[key] = (correctParams[key] !== undefined) ? correctParams[key] : methodDefaults[key];
    }

    return finalParams;
}