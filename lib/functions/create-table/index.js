const consoleQuery = require('../../tools/console-query');
const Table = require('../../class/table');
const wrapCall = require('../../tools/wrap-call');

/**
 * @typedef {import("./types").CreateTableFunction} CreateTableFunction
*/
/**@type {CreateTableFunction}*/
const createTable = ([sqliteDb, db], {tableName, columns, logQuery=true}) =>
new Promise((resolve, reject) =>
{

  const stringColumns = Object
  .entries(columns)
  .map(([name, type]) => `${name} ${type}`).join(', ');

  const finalQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${stringColumns})`;

  if(logQuery) consoleQuery(finalQuery);

  wrapCall.run(sqliteDb, finalQuery, []).then(() =>
  {
    if (logQuery) console.log(`Checked table '${tableName}'. Created if it did not exist.`);
    resolve(new Table(tableName, db));
  })
  .catch(reject);
});

module.exports = createTable;