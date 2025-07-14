const consoleQuery = require('../console-query');
const getWhereStatement = require('../get-where-statement');

/**@typedef {import("./types").DeleteFunction} DeleteFunction*/
/**@type {DeleteFunction}*/
const deleteFunc = ({ db, table, where, connector, logQuery }) =>
new Promise((resolve, reject) =>
{
    const whereStatement = getWhereStatement(where, connector);
    const finalQuery = `DELETE FROM ${table} ${whereStatement.query}`;
    const parameters = whereStatement.values;

    if(logQuery) consoleQuery(finalQuery, parameters);

    db.run(finalQuery, parameters, function (err)
    {
        if (err)
        {
            reject(err);
        }
        else
        {
            if(logQuery) console.log('Delete performed.');
            resolve(this.changes);
        }
    });
});

module.exports = deleteFunc;