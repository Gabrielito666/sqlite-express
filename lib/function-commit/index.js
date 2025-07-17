/**@typedef {import("./types").CommitFunction} CommitFunction */
const consoleQuery = require("../tool-console-query");

/**@type {CommitFunction}*/
const commit = (options) =>
new Promise((resolve, reject) =>
{
    const {db, logQuery} = options;

    if(!db) return reject(new Error("SqliteExpress - Commit Error: The database is not defined"));

    db.sqliteDb.run("COMMIT", [],
        (err) =>
        {
            if (err)
            {
                reject(err);
            }
            if (logQuery)
            {
                consoleQuery("COMMIT");
            }
            resolve(true);
        }
    );
});

module.exports = commit;