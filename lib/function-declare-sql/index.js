const consoleQuery = require("../tool-console-query");

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

    if(logQuery)
    {
        consoleQuery(query);
    }
        //Determine the type of query
        const typeQuery = (() =>
        {
            if(type === "any")
            {
                const simplifiedSql = query.toLowerCase().trim().replace(/\s+/g, ' ');
                const firstTokenMatch = simplifiedSql.match(/^\(? *(select|insert|update|delete|create|commit|rollback|begin)/);
                return firstTokenMatch ? firstTokenMatch[1] : 'non-select';
            }
            else
            {
                return type;
            }
        })();

    const stmt = db.sqliteDb.prepare(query, (err) =>
    {
        if(err)
        {
            reject(err);
            return;
        }
        else
        {
            //@ts-ignore
            const func = (params) => new Promise((rsl, rj) =>
            {
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