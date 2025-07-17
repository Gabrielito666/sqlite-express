const { parametersEvalBeginTransaction } = require("../tool-parameters-eval");
const consoleQuery = require("../tool-console-query");

/**@typedef {import("./types").BeginTransactionFunction} BeginTransactionFunction */
/**@type {BeginTransactionFunction}*/
const beginTransaction = (options) =>
new Promise((resolve, reject) =>
{
    const {db, logQuery} = parametersEvalBeginTransaction(options);

    db.sqliteDb.run("BEGIN TRANSACTION", [],
        (err) =>
        {
            if (err)
            {
                reject(err);
            }
            if (logQuery)
            {
                consoleQuery("BEGIN TRANSACTION");
            }
            resolve(true);
        }
    );
});

module.exports = beginTransaction;