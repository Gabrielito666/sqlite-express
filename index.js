const newDB = require('./modules/db');
const createTable = require('./modules/table');
const insertDB = require('./modules/insert');
const selectDB = require('./modules/select');
const updateDB = require('./modules/update');
const deleteDB = require('./modules/delete');

module.exports = {
    create : { db : newDB, table : createTable },
    insert : insertDB,
    select : selectDB,
    update : updateDB,
    delete : deleteDB
}