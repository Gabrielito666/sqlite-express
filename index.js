const newDB = require('./modules/db');
const createTable = require('./modules/table');
const insertDB = require('./modules/insert');
const selectDB = require('./modules/select');
const updateDB = require('./modules/update');
const deleteDB = require('./modules/delete');
const procecedRows = require('./modules/submodules/procecedRows');

module.exports = {
    createDB: newDB,
    createTable: createTable,
    insert: insertDB,
    select: async(db, table, col, where, conect)=>{return procecedRows(await selectDB(db, table, col, where, conect))},
    update: updateDB,
    delete: deleteDB
};