const consoleQuery = require('../tool-console-query');
const getWhereStatement = require('../tool-get-where-statement');
const {parametersEvalCount} = require('../tool-parameters-eval');

/**@typedef {import("./types").CountFunction} CountFunction*/

/**@type {CountFunction}*/
const count = (options) =>
new Promise((resolve, reject) =>
{
    const {db, table, where, connector, logQuery} = parametersEvalCount(options);

    const whereStatement = getWhereStatement(where, connector);
    const finalQuery = `SELECT COUNT(*) FROM ${table} ${whereStatement.query}`;
    const placeHolders = whereStatement.values;
    if(logQuery) consoleQuery(finalQuery, placeHolders);
    db.sqliteDb.get(finalQuery, placeHolders, function(err, count)
    {
        if (err)
        {
            reject(err);
        }
        else
        {
            if(logQuery) console.log('Count performed.');
            resolve(count['COUNT(*)']);
        }
    });
});

module.exports = count;