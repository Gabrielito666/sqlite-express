const createTable = require( './table' );
const insertDB = require( './insert' );
const selectDB = require( './select' );
const updateDB = require( './update' );
const deleteDB = require( './delete' );
const exist = require( './exist' );
const count = require( './count' );

module.exports = {
    createTable : createTable,
    insert : insertDB,
    select : selectDB,
    update : updateDB,
    delete : deleteDB,
    exist : exist,
    count : count
};