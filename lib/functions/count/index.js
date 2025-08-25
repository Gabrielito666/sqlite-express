const consoleQuery = require('../../tools/console-query');
const getWhereStatement = require('../../tools/get-where-statement');
const wrapCall = require('../../tools/wrap-call');
/**@typedef {import("./types").CountFunction} CountFunction*/

/**@type {CountFunction}*/
const count = (sqliteDb, {table, where, logQuery=true}) =>
new Promise((resolve, reject) =>
{
    const tableName = typeof table === 'string' ? table : table.options.table;

    const whereStatement = getWhereStatement(where);
    const finalQuery = `SELECT COUNT(*) FROM ${tableName} ${whereStatement.query}`;
    const placeHolders = whereStatement.values;

    if(logQuery) consoleQuery(finalQuery, placeHolders);

    wrapCall.get(sqliteDb, finalQuery, placeHolders).then(count =>
    {
        if(logQuery) console.log('Count performed.');
        resolve(typeof count["COUNT(*)"] === 'number' ? count["COUNT(*)"] : 0);
    })
    .catch(reject);
});

module.exports = count;