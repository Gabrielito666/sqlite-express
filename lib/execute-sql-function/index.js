const consoleQuery = require("../console-query");
const expectedSwitch = require("../expected-switch");
const normalizeParameters = require("../normalize-parameters");

/**@typedef {import("./types.d.ts").ExecuteSQLFunction} ExecuteSQLFunction*/
/**@type {ExecuteSQLFunction}*/
const executeSQL =
({
    db,
    query,
    logQuery,
    expected= /**@type {"rows"}*/ ("rows"),
    parameters = {},
    type="any"
}) =>
new Promise(( resolve, reject ) =>
{
    // Solo lanzar error si hay placeholders realmente malformados (por ejemplo, ?- sin cerrar -?)
    const malformedParamsRegex = /(\?-[^\-]*$|\@-[^\-]*$|\$-[^\-]*$|\?-[^\-]*-(?!\?)|\@-[^\-]*-(?!\@)|\$-[^\-]*-(?!\$))/g;
    if(malformedParamsRegex.test(query))
    {
        throw new Error(`Syntax error: bad parameters detected in query: "${query}". Please check for malformed placeholders or parameter markers.`);
    }

    const counterRef = { current: 0 };

    // Procesar parámetros internos y reemplazarlos por parámetros nombrados únicos
    const internalParamsRegex = /(\?-.*?-\?|\@-.*?-\@|\$-.*?-\$)/g;
    const processedQuery = query.replace(internalParamsRegex, (match) =>
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
            const firstTokenMatch = simplifiedSql.match(/^\(? *(select|insert|update|delete|create|alter|drop|pragma|begin|commit|rollback)/);
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
        // SELECT queries - use expectedSwitch for different result types
        expectedSwitch({
            db,
            query: processedQuery,
            parameters: normalizedParameters,
            expected,
            logQuery
        })
        //@ts-ignore
        .then(resolve).catch(reject);
    }
    else if(typeQuery === 'insert')
    {
        // INSERT queries - return lastID
        db.run(processedQuery, normalizedParameters, function(err)
        {
            if(err)
            {
                reject(err)
            }
            else
            {
                if(logQuery) console.log('Insert query executed successfully');
                //@ts-ignore
                resolve(this.lastID);
            }
        });
    }
    else if(typeQuery === 'update' || typeQuery === 'delete')
    {
        // UPDATE/DELETE queries - return number of affected rows
        db.run(processedQuery, normalizedParameters, function(err)
        {
            if(err)
            {
                reject(err)
            }
            else
            {
                if(logQuery) console.log(`${typeQuery} query executed successfully`);
                //@ts-ignore
                resolve(this.changes);
            }
        });
    }
    else if(typeQuery === 'create')
    {
        // CREATE queries - return void
        db.run(processedQuery, normalizedParameters, function(err)
        {
            if(err)
            {
                reject(err)
            }
            else
            {
                if(logQuery) console.log('Query executed successfully');
                //@ts-ignore
                resolve();
            }
        });
    }
    else
    {
        // Other queries (PRAGMA, transactions, etc.) - return result
        db.run(processedQuery, normalizedParameters, function(err)
        {
            if(err)
            {
                reject(err)
            }
            else
            {
                if(logQuery) console.log('Query executed successfully');
                //@ts-ignore
                resolve(this.changes);
            }
        });
    }
});


module.exports = executeSQL;