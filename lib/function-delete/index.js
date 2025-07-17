const consoleQuery = require('../tool-console-query');
const getWhereStatement = require('../tool-get-where-statement');

/**@typedef {import("./types").DeleteFunction} DeleteFunction*/
/**@type {DeleteFunction}*/
const deleteFunc = (options) =>
new Promise((resolve, reject) =>
{
    const {db, table, where, connector, logQuery} = options;
    if(!db) return reject(new Error("SqliteExpress - Delete Error: The database is not defined"));
    if(!table) return reject(new Error("SqliteExpress - Delete Error: The table is not defined"));

    const tableName = typeof table === 'string' ? table : table.options.table;

    const whereStatement = getWhereStatement(where, connector);
    const finalQuery = `DELETE FROM ${tableName} ${whereStatement.query}`;
    const parameters = whereStatement.values;

    if(logQuery) consoleQuery(finalQuery, parameters);

    db.sqliteDb.run(finalQuery, parameters, function (err)
    {
        if (err)
        {
            reject(err);
        }
        else
        {
            if(logQuery) console.log('Delete performed.');
            resolve(this.changes);
        }
    });
});

module.exports = deleteFunc;