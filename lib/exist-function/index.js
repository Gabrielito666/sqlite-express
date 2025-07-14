const consoleQuery = require('../console-query');
const getWhereStatement = require('../get-where-statement');

/**@typedef {import("./types").ExistFunction} ExistFunction*/

/**@type {ExistFunction}*/
const exist = ({ db, table, where, connector, logQuery }) =>
new Promise((resolve, reject) =>
{
    const whereStatement = getWhereStatement(where, connector);
    const finalQuery = `SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END FROM ${table} ${whereStatement.query}`;
    const parameters = whereStatement.values;

    if(logQuery) consoleQuery(finalQuery, parameters);
    
    db.get(finalQuery, parameters, function(err, exist)
    {
        if (err)
        {
            reject(err);
        }
        else
        {
            if(logQuery) console.log('Existence verification performed.');
            resolve(exist['CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END'] === 1);
        }
    });
});

module.exports = exist;