const consoleQuery = require('../tool-console-query');
const getWhereStatement = require('../tool-get-where-statement');

/**@typedef {import("./types").ExistFunction} ExistFunction*/

/**@type {ExistFunction}*/
const exist = (options) =>
new Promise((resolve, reject) =>
{
    const {db, table, where, connector, logQuery} = options;
    if(!db) return reject(new Error("SqliteExpress - Exist Error: The database is not defined"));
    if(!table) return reject(new Error("SqliteExpress - Exist Error: The table is not defined"));

    const tableName = typeof table === 'string' ? table : table.options.table;

    const whereStatement = getWhereStatement(where, connector);
    const finalQuery = `SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END FROM ${tableName} ${whereStatement.query}`;
    const parameters = whereStatement.values;

    if(logQuery) consoleQuery(finalQuery, parameters);
    
    db.sqliteDb.get(finalQuery, parameters, function(err, exist)
    {
        if (err)
        {
            reject(err);
        }
        else
        {
            if(logQuery) console.log('Existence verification performed.');
            resolve(exist['CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END'] === 1);
        }
    });
});

module.exports = exist;