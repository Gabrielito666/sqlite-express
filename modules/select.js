const whereConstructor = require( './submodules/where' );
const joinConstructor = require( './submodules/join' );
const selectConstructor = require( './submodules/select' );
const consoleQuery = require( './submodules/consoleQuery' );
const processResult = require( './submodules/processResult' );

module.exports = async ( { db, table, select, where, connector, processColumns, processRows, emptyResult, logQuery, join } ) => {

  select = selectConstructor(select);

  return await new Promise( ( resolve, reject ) => {
    let finalQuery = `SELECT ${ select } FROM ${ table } ${ joinConstructor({ table, join }) } ${ whereConstructor.query( where, connector ) }`;
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

/*
EL SELECT PUEDE SER 

un string con lo que se desee

ej: 
  'column_1, columns_2, column_3'
  'table_1.column_1, table_1.column_2, table_2.column_3'
  'column_1 AS newName, column_2'
...

un array con strings

ej: 
  [ 'column_1', 'columns_2', 'column_3' ]
  [ 'table_1.column_1', 'table_1.column_2', 'table_2.column_3' ]
  [ 'column_1 AS newName', 'column_2' ]
...

un array con objetos:

ej: 
  [ { column : 'column_1' }, { column : 'columns_2' }, { column : 'column_3' } ]
  [
    { table : 'table_1', column : 'column_1' },
    { table : 'table_1', column : 'column_2' }, 
    { table : 'table_2', column : 'column_3' }
  ]
  [ { column : 'column_1', as : 'newName', { column : 'column_2' } ]
...

aprobechando el tiron hay que hacer que insert, delete y update retornen la cantidad de filas
insertadas o modificadas

createTable puede retornar un boolean o algo así y también crear el metodo executeSQL

QUIZAS CON UN SISTEMA DE PLACEHOLDERS MÄS AMENO

*/