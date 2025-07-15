const consoleQuery = require('../tool-console-query');
const getWhereStatement = require('../tool-get-where-statement');
const {parametersEvalDelete} = require('../tool-parameters-eval');

/**@typedef {import("./types").DeleteFunction} DeleteFunction*/
/**@type {DeleteFunction}*/
const deleteFunc = (options) =>
new Promise((resolve, reject) =>
{
    const {db, table, where, connector, logQuery} = parametersEvalDelete(options);

    const whereStatement = getWhereStatement(where, connector);
    const finalQuery = `DELETE FROM ${table} ${whereStatement.query}`;
    const parameters = whereStatement.values;

    if(logQuery) consoleQuery(finalQuery, parameters);

    db.sqliteDb.run(finalQuery, parameters, function (err)
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