const newDB = require('./modules/db');
const createTable = require('./modules/table');
const insertDB = require('./modules/insert');
const selectDB = require('./modules/select');
const updateDB = require('./modules/update');
const deleteDB = require('./modules/delete');

module.exports = {
    createDB: newDB,
    createTable: createTable,
    insert: insertDB,
    select: selectDB,
    update: updateDB,
    delete: deleteDB
};
