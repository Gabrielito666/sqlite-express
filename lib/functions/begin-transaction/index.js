const consoleQuery = require("../../tools/console-query");
const wrapCall = require("../../tools/wrap-call");

/**@typedef {import("./types").BeginTransactionFunction} BeginTransactionFunction */
/**@type {BeginTransactionFunction}*/
const beginTransaction = (sqliteBeginTransactionStmt, {logQuery=true}) =>
new Promise((resolve, reject) =>
{
    wrapCall.statement.run(sqliteBeginTransactionStmt, []).then(() =>
    {
        if (logQuery)
        {
            consoleQuery("BEGIN TRANSACTION");
        }
        resolve(true);
    })
    .catch(reject);
});

module.exports = beginTransaction;