const createTable = require( './table' );
const insertDB = require( './insert' );
const selectDB = require( './select' );
const updateDB = require( './update' );
const deleteDB = require( './delete' );

module.exports = {
    createTable : createTable,
    insert : insertDB,
    select : selectDB,
    update : updateDB,
    delete : deleteDB 
}