const consoleQuery = require('../../tools/console-query');
const getWhereStatement = require('../../tools/get-where-statement');
const wrapCall = require('../../tools/wrap-call');

/**@typedef {import("./types").ExistFunction} ExistFunction*/

/**@type {ExistFunction}*/
const exist = (sqliteDb, {table, where, logQuery=true}) =>
new Promise((resolve, reject) =>
{
    const tableName = typeof table === 'string' ? table : table.options.table;

    const whereStatement = getWhereStatement(where);
    const finalQuery = `SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END FROM ${tableName} ${whereStatement.query}`;
    const parameters = whereStatement.values;

    if(logQuery) consoleQuery(finalQuery, parameters);
    
    wrapCall.get(sqliteDb, finalQuery, parameters).then(exist =>
    {
        if(logQuery) console.log('Existence verification performed.');
        resolve(exist ? exist['CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END'] === 1 : false);
    })
    .catch(reject);
});

module.exports = exist;
