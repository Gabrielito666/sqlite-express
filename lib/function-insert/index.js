const consoleQuery = require('../tool-console-query');

/**
 * @typedef {import("./types").InsertFunction} InsertFunction;
*/
/**@type {InsertFunction}*/
const insert = (options) =>
new Promise((resolve, reject) =>
{
    const {db, table, row, logQuery} = options;
    if(!db) return reject(new Error("SqliteExpress - Insert Error: The database is not defined"));
    if(!table) return reject(new Error("SqliteExpress - Insert Error: The table is not defined"));
    if(!row) return reject(new Error("SqliteExpress - Insert Error: The row is not defined"));

    const tableName = typeof table === 'string' ? table : table.options.table;

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

    db.sqliteDb.run(finalQuery, parameters,
        /**
         * @param {Error|null} err
         * @this {any}
         */
        function (err)
        {
            if (err)
            {
                reject(err);
            }
            else
            {
                if (logQuery)
                {
                    console.log('Row inserted successfully.');
                }
                resolve(this.lastID);
            }
        }
    );
});


module.exports = insert;