const consoleQuery = require('../../tools/console-query');
const getWhereStatement = require('../../tools/get-where-statement');
const wrapCall = require('../../tools/wrap-call');

/**@typedef {import("./types").DeleteFunction} DeleteFunction*/
/**@type {DeleteFunction}*/
const deleteFunc = (sqliteDb, {table, where, logQuery=true}) =>
new Promise((resolve, reject) =>
{
    const tableName = typeof table === 'string' ? table : table.tableName;

    const whereStatement = getWhereStatement(where);
    const finalQuery = `DELETE FROM ${tableName} ${whereStatement.query}`;
    const parameters = whereStatement.values;

    if(logQuery) consoleQuery(finalQuery, parameters);

    wrapCall.run(sqliteDb, finalQuery, parameters).then((runResult) =>
    {
        if(logQuery) console.log('Delete performed.');
        resolve(runResult.changes);
    })
    .catch(reject);
});

module.exports = deleteFunc;