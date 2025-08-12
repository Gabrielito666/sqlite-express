const consoleQuery = require("../tool-console-query");
const normalizeParameters = require("../tool-normalize-parameters");
const pathOrSql = require("../tool-path-or-sql");

/**
 *@typedef {import("./types").DeclareSQLFunction} DeclareSQLFunction
*/

/**@type {DeclareSQLFunction}*/
const declareSQL = (options) => new Promise((resolve, reject) =>
{
    /** @type {import("../class-options/types").OptionsType} */
    const {db, logQuery, query, type="any", expected="rows"} = options;

    if(!db) return reject(new Error("SqliteExpress - Declare SQL Error: The database is not defined"));
    if(!query) return reject(new Error("SqliteExpress - Declare SQL Error: The query is not defined"));

    const queryString = pathOrSql(query);

    if(logQuery)
    {
        consoleQuery(queryString);
    }
        //Determine the type of query
        const typeQuery = (() =>
        {
            if(type === "any")
            {
                const simplifiedSql = queryString.toLowerCase().trim().replace(/\s+/g, ' ');
                const firstTokenMatch = simplifiedSql.match(/^\(? *(select|insert|update|delete|create|commit|rollback|begin)/);
                return firstTokenMatch ? firstTokenMatch[1] : 'non-select';
            }
            else
            {
                return type;
            }
        })();

    const stmt = db.sqliteDb.prepare(queryString, (err) =>
    {
        if(err)
        {
            reject(err);
            return;
        }
        else
        {
            //@ts-ignore
            const func = (...args) => new Promise((rsl, rj) =>
            {
                // Handle both parameter styles:
                // 1. Single object with named parameters: fn({param: value}) or fn({'@param': value})
                // 2. Multiple arguments for positional parameters: fn(value1, value2, value3)
                const params = (() =>
                {
                    if (args.length === 0 || (args.length === 1 && args[0] === null))
                    {
                        // No parameters or explicit null
                        return {};
                    }
                    else if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null)
                    {
                        // Object-style parameters
                        return normalizeParameters(args[0]);
                    }
                    else
                    {
                        // Positional parameters - pass as array for sqlite3
                        return args;
                    }
                })();
                
                if(typeQuery === "select")
                {
                    stmt.all(params, function(err, rows)
                    {
                        if(err)
                        {
                            rj(err);
                            return;
                        }
                        if(rows.length === 0)
                        {
                            if(expected === "celd" || expected === "row")
                            {
                                rsl(null);
                            }
                            else if(expected === "rows" || expected === "column")
                            {
                                rsl([]);
                            }
                            return;
                        }
                        else if(expected === "celd")
                        {
                            rsl(Object.values(rows[0])[0]);
                        }
                        else if(expected === "row")
                        {
                            rsl(rows[0]);
                        }
                        else if(expected === "rows")
                        {
                            rsl(rows);
                        }
                        else if(expected === "column")
                        {
                            rsl(rows.map(row => Object.values(row)[0]));
                        }
                    });
                }
                else
                {
                    stmt.run(params, function(err)
                    {
                        if(err)
                        {
                            rj(err);
                            return;
                        }
                        if(typeQuery === "insert")
                        {
                            rsl(this.lastID);
                        }
                        else if(typeQuery === "update" || typeQuery === "delete")
                        {
                            rsl(this.changes);
                        }
                        else
                        {
                            rsl(void 0);
                        }
                    });
                }
            });

            resolve(func);
        }        
    })
});

module.exports = declareSQL;