const consoleQuery = require('../tool-console-query');
const Table = require('../class-table');

/**
 * 
 * @typedef {import("./types").CreateTableFunction} CreateTableFunction
*/
/**@type {CreateTableFunction}*/
const createTable = (options) =>
new Promise((resolve, reject) =>
{
  const {db, table, columns, logQuery} = options;
  if(!db) return reject(new Error("SqliteExpress - Create Table Error: The database is not defined"));
  if(!table) return reject(new Error("SqliteExpress - Create Table Error: The table is not defined"));
  if(!columns) return reject(new Error("SqliteExpress - Create Table Error: The columns is not defined"));
  if(typeof table !== 'string') return reject(new Error("SqliteExpress - Create Table Error: In the table creation, the table parameter must be a sting and not a Table object"));
  
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