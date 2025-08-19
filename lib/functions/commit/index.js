/**@typedef {import("./types").CommitFunction} CommitFunction */
const consoleQuery = require("../../tools/console-query");
const wrapCall = require("../../tools/wrap-call");

/**@type {CommitFunction}*/
const commit = (sqliteCommitStmt, {logQuery=true}={logQuery:true}) =>
new Promise((resolve, reject) =>
{
    wrapCall.statement.run(sqliteCommitStmt, []).then(() =>
    {
            if (logQuery)
            {
                consoleQuery("COMMIT");
            }
            resolve(true);
    })
    .catch(reject);
});

module.exports = commit;