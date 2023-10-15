const is = require( './is' );
module.exports = ( rows, processColumns, processRows, emptyResult )=>{
    if( rows.length === 0 ) return emptyResult;
    let [ oneRow, oneColumn ] = [ ( rows.length === 1 ), ( Object.keys( rows[ 0 ] ).length === 1 ) ];

    rows.forEach( row=> {
        Object.keys( row ).forEach( prop =>{
            if( is.j( row[ prop ] ) ) row[ prop ]=JSON.parse( row[ prop ] ) 
        } )
    } )

    if( oneColumn && processColumns ) rows = rows.map(row => row[ Object.keys( row )[ 0 ] ] );
    if( oneRow && processRows ) rows = rows[ 0 ];
    return rows;
};


