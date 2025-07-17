const getWhereConstructor = require('../tool-get-where-statement');
const consoleQuery = require('../tool-console-query');

/**
 * @typedef {import("./types").SelectFunction} SelectFunction
*/
/**@type {SelectFunction}*/
const select = (options) =>
new Promise((resolve, reject) =>
{
    const {db, table, select, where, connector, logQuery, expected = "rows"} = options;
    
    if(!db) return reject(new Error("SqliteExpress - Select Error: The database is not defined"));
    if(!table) return reject(new Error("SqliteExpress - Select Error: The table is not defined"));
    if(!select) return reject(new Error("SqliteExpress - Select Error: The select is not defined"));

    const tableName = typeof table === 'string' ? table : table.options.table;

    const selectStringRef = { current: select };

    if (Array.isArray(select))
    {
        selectStringRef.current = select.join(', ');
    }
    else if (typeof select === "object")
    {
        selectStringRef.current = Object
            .entries(select).map(([key, value]) => `${key} AS ${value.as}`)
            .join(', ');
    }

    const whereStatement = getWhereConstructor(where, connector);

    const finalQuery = `SELECT ${selectStringRef.current} FROM ${tableName} ${whereStatement.query}`;
    const parameters = whereStatement.values;
    if (logQuery) consoleQuery(finalQuery, parameters);

    db.sqliteDb.all(finalQuery, parameters, function(err, rows)
    {
        if(err)
        {
            reject(err);
            return;
        }
        
        // Handle empty results
        if (!rows || rows.length === 0)
        {
            if(expected === "celd" || expected === "row")
            {
                // @ts-ignore
                resolve(null);
            }
            else if(expected === "rows" || expected === "column")
            {
                // @ts-ignore
                resolve([]);
            }
            return;
        }
        
        if(expected === "celd")
        {
            resolve(Object.values(rows[0])[0]);
        }
        else if(expected === "row")
        {
            resolve(rows[0]);
        }
        else if(expected === "rows")
        {
            //@ts-ignore
            resolve(rows);
        }
        else if(expected === "column")
        {
            //@ts-ignore
            resolve(rows.map(row => Object.values(row)[0]));
        }
    });
});

module.exports = select;