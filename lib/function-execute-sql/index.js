const consoleQuery = require("../tool-console-query");
const normalizeParameters = require("../tool-normalize-parameters");
const pathOrSql = require("../tool-path-or-sql");

/**
 * @typedef {import("./types").ExecuteSQLFunction} ExecuteSQLFunction
 * @typedef {import("../types/returns").Returns} Returns
*/
/**@type {ExecuteSQLFunction}*/
const executeSQL = (options) =>
/**@type {Returns["executeSQL"]}*/ (new Promise(( resolve, reject ) =>
{
    const {db, query, logQuery, expected="rows", parameters, type="any"} = options;
    if(!db) return reject(new Error("SqliteExpress - Execute SQL Error: The database is not defined"));
    if(!query) return reject(new Error("SqliteExpress - Execute SQL Error: The query is not defined"));

    const queryString = pathOrSql(query);

    // Solo lanzar error si hay placeholders realmente malformados (por ejemplo, ?- sin cerrar -?)
    const malformedParamsRegex = /(\?-[^\-]*$|\@-[^\-]*$|\$-[^\-]*$|\?-[^\-]*-(?!\?)|\@-[^\-]*-(?!\@)|\$-[^\-]*-(?!\$))/g;
    if(malformedParamsRegex.test(queryString))
    {
        throw new Error(`Syntax error: bad parameters detected in query: "${queryString}". Please check for malformed placeholders or parameter markers.`);
    }

    const counterRef = { current: 0 };

    // Procesar parámetros internos y reemplazarlos por parámetros nombrados únicos
    const internalParamsRegex = /(\?-.*?-\?|\@-.*?-\@|\$-.*?-\$)/g;
    const processedQuery = queryString.replace(internalParamsRegex, (match) =>
    {
        const param = match.replace(/^[\?\@\$]-|-[\?\@\$]$/g, '');
        counterRef.current++;
        const processedParam = (() => {
            if(param.toLowerCase() === 'null') return null;
            else if(!isNaN(Number(param)) && param.trim() !== '') return Number(param);
            else return param;
        })();
        parameters[`@execsqlparam${counterRef.current}`] = processedParam;
        return `@execsqlparam${counterRef.current}`;
    });

    //Determine the type of query
    const typeQuery = (() =>
    {
        if(type === "any")
        {
            const simplifiedSql = processedQuery.toLowerCase().trim().replace(/\s+/g, ' ');
            const firstTokenMatch = simplifiedSql.match(/^\(? *(select|insert|update|delete|create|begin|commit|rollback)/);
            return firstTokenMatch ? firstTokenMatch[1] : 'non-select';
        }
        else
        {
            return type;
        }
    })();

    const normalizedParameters = normalizeParameters(parameters);

    if(logQuery) consoleQuery(processedQuery, normalizedParameters);

    // Handle different query types
    if(typeQuery === 'select')
    {
        db.sqliteDb.all(processedQuery, normalizedParameters, function(err, rows)
        {
            if(err)
            {
                reject(err);
                return;
            }
            if(rows.length === 0)
            {
                if(expected === "celd" || expected === "row")
                {
                    resolve(null);
                }
                else if(expected === "rows" || expected === "column")
                {
                    resolve([]);
                }
                return;
            }
            else if(expected === "celd")
            {
                resolve(Object.values(rows[0])[0]);
            }
            else if(expected === "row")
            {
                resolve(rows[0]);
            }
            else if(expected === "rows")
            {
                resolve(rows);
            }
            else if(expected === "column")
            {
                resolve(rows.map(row => Object.values(row)[0]));
            }
        });
    }
    else if(typeQuery === 'insert')
    {
        // INSERT queries - return lastID
        db.sqliteDb.run(processedQuery, normalizedParameters, function(err)
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                if(logQuery) console.log('Insert query executed successfully');
                resolve(this.lastID);
            }
        });
    }
    else if(typeQuery === 'update' || typeQuery === 'delete')
    {
        // UPDATE/DELETE queries - return number of affected rows
        db.sqliteDb.run(processedQuery, normalizedParameters, function(err)
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                if(logQuery) console.log(`${typeQuery} query executed successfully`);
                resolve(this.changes);
            }
        });
    }
    else
    {
        // CREATE queries - return void
        db.sqliteDb.run(processedQuery, normalizedParameters, function(err)
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                if(logQuery) console.log('Query executed successfully');
                resolve(void 0);
            }
        });
    }
}));


module.exports = executeSQL;