const consoleQuery = require("../tool-console-query");

/**@typedef {import("./types").RollbackFunction} RollbackFunction */
/**@type {RollbackFunction}*/
const rollback = (options) =>
new Promise((resolve, reject) =>
{
    const {db, logQuery} = options;
    if(!db) return reject(new Error("SqliteExpress - Rollback Error: The database is not defined"));

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