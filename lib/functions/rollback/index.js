const consoleQuery = require("../../tools/console-query");
const wrapCall = require("../../tools/wrap-call");

/**@typedef {import("./types").RollbackFunction} RollbackFunction */
/**@type {RollbackFunction}*/
const rollback = (stmtRollback, {logQuery=true}={logQuery:true}) =>
new Promise((resolve, reject) =>
{
    wrapCall.statement.run(stmtRollback, []).then(() =>
    {
        if (logQuery) consoleQuery("ROLLBACK");
        resolve(true);
    })
    .catch(reject);
});

module.exports = rollback;