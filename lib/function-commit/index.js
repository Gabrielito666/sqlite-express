/**@typedef {import("./types").CommitFunction} CommitFunction */
const { parametersEvalCommit } = require("../tool-parameters-eval");
const consoleQuery = require("../tool-console-query");

/**@type {CommitFunction}*/
const commit = (options) =>
new Promise((resolve, reject) =>
{
    const {db, logQuery} = parametersEvalCommit(options);

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