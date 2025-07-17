const consoleQuery = require('../tool-console-query');
const getWhereStatement = require('../tool-get-where-statement');

/**@typedef {import("./types").CountFunction} CountFunction*/

/**@type {CountFunction}*/
const count = (options) =>
new Promise((resolve, reject) =>
{
    const {db, table, where, connector, logQuery} = options;
    if(!db) return reject(new Error("SqliteExpress - Count Error: The database is not defined"));
    if(!table) return reject(new Error("SqliteExpress - Count Error: The table is not defined"));

    const tableName = typeof table === 'string' ? table : table.options.table;

    const whereStatement = getWhereStatement(where, connector);
    const finalQuery = `SELECT COUNT(*) FROM ${tableName} ${whereStatement.query}`;
    const placeHolders = whereStatement.values;
    if(logQuery) consoleQuery(finalQuery, placeHolders);
    db.sqliteDb.get(finalQuery, placeHolders, function(err, count)
    {
        if (err)
        {
            reject(err);
        }
        else
        {
            if(logQuery) console.log('Count performed.');
            resolve(count['COUNT(*)']);
        }
    });
});

module.exports = count;