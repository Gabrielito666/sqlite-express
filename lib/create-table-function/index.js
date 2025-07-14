const consoleQuery = require('../console-query');
/**
 * 
 * @typedef {import("./types").CreateTableFunction} CreateTableFunction
*/
/**@type {CreateTableFunction}*/
const createTable = ({ db, table, columns, logQuery }) =>
new Promise((resolve, reject) =>
{
  const stringColumns = Object
  .entries(columns)
  .map(([name, type]) => `${name} ${type}`).join(', ');

  const finalQuery = `CREATE TABLE IF NOT EXISTS ${table} (${stringColumns})`;
  
  if(logQuery) consoleQuery(finalQuery);
  
  db.run(finalQuery, function(err)
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
      resolve();
    }
  });
});

module.exports = createTable;