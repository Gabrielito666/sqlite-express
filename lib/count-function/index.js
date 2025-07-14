const consoleQuery = require('../console-query');
const getWhereStatement = require('../get-where-statement');

/**@typedef {import("./types").CountFunction} CountFunction*/

/**@type {CountFunction}*/
const count = ({ db, table, where, connector, logQuery }) =>
new Promise((resolve, reject) =>
{
    const whereStatement = getWhereStatement(where, connector);
    const finalQuery = `SELECT COUNT(*) FROM ${table} ${whereStatement.query}`;
    const placeHolders = whereStatement.values;
    if(logQuery) consoleQuery(finalQuery, placeHolders);
    db.get(finalQuery, placeHolders, function(err, count)
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