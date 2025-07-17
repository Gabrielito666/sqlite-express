const consoleQuery = require('../tool-console-query');
const {parametersEvalCreateTable} = require('../tool-parameters-eval');
const Table = require('../class-table');
/**
 * 
 * @typedef {import("./types").CreateTableFunction} CreateTableFunction
*/
/**@type {CreateTableFunction}*/
const createTable = (options) =>
new Promise((resolve, reject) =>
{
  const {db, table, columns, logQuery} = parametersEvalCreateTable(options);

  const stringColumns = Object
  .entries(columns)
  .map(([name, type]) => `${name} ${type}`).join(', ');

  const finalQuery = `CREATE TABLE IF NOT EXISTS ${table} (${stringColumns})`;
  
  if(logQuery) consoleQuery(finalQuery);
  
  db.sqliteDb.run(finalQuery, function(err)
  {
    if (err)
    {
      console.error(err.message);
      reject(err);
      return;
    }
    else
    {
      if (logQuery) console.log(`Checked table '${table}'. Created if it did not exist.`);
      resolve(new Table(table, db));
    }
  });
});

module.exports = createTable;