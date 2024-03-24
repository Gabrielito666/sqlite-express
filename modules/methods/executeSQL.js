const determineQueryType = require('./../submodules/determineQueryType');
const processResult = require('../submodules/processResult');
const consoleQuery = require('../submodules/consoleQuery');
const executeSQL = ({ db, query, logQuery, emptyResult, processColumns, processRows }) =>
{
    const prepareStatementWithMarks = sql =>
    {
        const values = [];
        const placeholderRegex = /\?-(.*?)-\?/g;
        let depth = 0;
    
        let placeholderSql = sql.replace(placeholderRegex, (match, value) => {
            values.push(value.trim());
            return '?';
        });
        
        for (let i = 0; i < sql.length - 1; i++) {
            if (sql[i] === '?' && sql[i + 1] === '-') depth++;
            if (sql[i] === '-' && sql[i + 1] === '?') depth--;
            if (depth < 0) throw new Error("Syntax error: closing marker without corresponding opening.");
        }
        if (depth > 0) throw new Error("Syntax error: opening of marker without corresponding closing.");
    
        return { placeholderSql, values };
    };

    const { placeholderSql, values } = prepareStatementWithMarks(query);
    const queryType = determineQueryType(placeholderSql);
    return new Promise(( resolve, reject ) =>
    {
        if(logQuery) consoleQuery(placeholderSql, values);
        if(queryType === 'select')
        {
            db.all(placeholderSql, values, (err, rows) =>
            {
                if(err)
                {
                    reject(err);
                }
                else
                {
                    if(logQuery) console.log('Your query was successfully executed');
                    resolve
                    (
                        (processColumns || processRows) ?
                        processResult( rows, processColumns, processRows, emptyResult ) :
                        rows
                    );
                }
            });
        }
        else
        {
            db.run(placeholderSql, values, function(err)
            {
                if(err)
                {
                    reject(err)
                }
                else
                {
                    if(logQuery) console.log('Your query was successfully executed');
                    resolve(this.changes);
                }
            });
        }
    });
};


module.exports = executeSQL;