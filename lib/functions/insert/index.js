const consoleQuery = require('../../tools/console-query');
const wrapCall = require('../../tools/wrap-call');

/**
 * @typedef {import("./types").InsertFunction} InsertFunction;
*/
/**@type {InsertFunction}*/
const insert = (sqliteDb, {table, row, logQuery=true}) =>
new Promise((resolve, reject) =>
{
    const tableName = typeof table === 'string' ? table : table.tableName;

    const cols = Object.keys(row);
    /**@type {Record<string, any>}*/
    const parameters = {};

    cols.forEach(col =>
    {
        let value = row[col];
        if (typeof value === 'object' && value !== null)
        {
            value = JSON.stringify(value);
        }
        if (typeof value === 'boolean')
        {
            value = value.toString();
        }
        parameters[`@${col}`] = value;
    });

    const columnsString = cols.join(', ');
    const valuesString = cols.map(col => `@${col}`).join(', ');

    const finalQuery = `INSERT INTO ${tableName} (${columnsString}) VALUES(${valuesString})`;

    if (logQuery)
    {
        consoleQuery(finalQuery, parameters);
    }

    wrapCall.run(sqliteDb, finalQuery, parameters).then((runResult) =>
    {
        if (logQuery) console.log('Row inserted successfully.');
        resolve(runResult.lastID);
    })
    .catch(reject);
});


module.exports = insert;