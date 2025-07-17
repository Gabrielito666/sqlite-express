const consoleQuery = require("../tool-console-query");

/**@typedef {import("./types").BeginTransactionFunction} BeginTransactionFunction */
/**@type {BeginTransactionFunction}*/
const beginTransaction = (options) =>
new Promise((resolve, reject) =>
{
    const {db, logQuery} = options;

    if(!db) return reject(new Error("SqliteExpress - Begin Transaction Error: The database is not defined"));

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