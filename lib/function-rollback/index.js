const { parametersEvalRollback } = require("../tool-parameters-eval");
const consoleQuery = require("../tool-console-query");

/**@typedef {import("./types").RollbackFunction} RollbackFunction */
/**@type {RollbackFunction}*/
const rollback = (options) =>
new Promise((resolve, reject) =>
{
    const {db, logQuery} = parametersEvalRollback(options);

    db.sqliteDb.run("ROLLBACK", [],
        (err) =>
        {
            if (err)
            {
                reject(err);
            }
            if (logQuery)
            {
                consoleQuery("ROLLBACK");
            }
            resolve(true);
        }
    );
});

module.exports = rollback;