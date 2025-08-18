const consoleQuery = require("../../tools/console-query");
const normalizeParameters = require("../../tools/normalize-parameters");
const pathOrSql = require("../../tools/path-or-sql");
const wrapCall = require("../../tools/wrap-call");

/**
 *@typedef {import("./types").DeclareSQLFunction} DeclareSQLFunction
 *@typedef {import("./types").StatementFunction} StatementFunction
 *@typedef {import("./types").StatementSentence} StatementSentence
*/


/**@type {DeclareSQLFunction}*/
const declareSQL = (sqliteDb, {query, logQuery=true}) => new Promise((resolve, reject) =>
{
    const queryString = pathOrSql(query);
    
    wrapCall.prepare(sqliteDb, queryString).then(stmt =>
    {

        /**@type {StatementSentence}*/
        const statementSentence = (parameters) =>
        {
            const normalizedParams = normalizeParameters(parameters);
            if(logQuery)
            {
                consoleQuery(queryString, normalizedParams);
            }
            return normalizedParams;
        };

        /**@type {StatementFunction["select"]["rows"]}*/
        const selectRows = (parameters) => new Promise((resolve, reject) =>
        {
            wrapCall.statement.all(stmt, statementSentence(parameters)).then(rows =>
            {
                resolve(rows);
            })
            .catch(reject);
        });

        /**@type {StatementFunction["select"]["row"]}*/
        const selectRow = (parameters) => new Promise((resolve, reject) =>
        {
            wrapCall.statement.get(stmt, statementSentence(parameters)).then(row =>
            {
                resolve(row);
            })
            .catch(reject);
        });

        /**@type {StatementFunction["select"]["celd"]}*/
        const selectCeld = (parameters) => new Promise((resolve, reject) =>
        {
            wrapCall.statement.get(stmt, statementSentence(parameters)).then(row =>
            {
                resolve(Object.values(row || {})[0] || null);
            })
            .catch(reject);
        });

        /**@type {StatementFunction["select"]["column"]}*/
        const selectColumn = (parameters) => new Promise((resolve, reject) =>
        {
            wrapCall.statement.all(stmt, statementSentence(parameters)).then(rows =>
            {
                resolve(rows.map(row => Object.values(row || {})[0] || null));
            })
            .catch(reject);
        });

        /**@type {StatementFunction["insert"]}*/
        const insert = (parameters) => new Promise((resolve, reject) =>
        {
            wrapCall.statement.run(stmt, statementSentence(parameters)).then(runResult =>
            {
                resolve(runResult.lastID);
            })
            .catch(reject);
        });

        /**@type {StatementFunction["update"]}*/
        const update = (parameters) => new Promise((resolve, reject) =>
        {
            wrapCall.statement.run(stmt, statementSentence(parameters)).then(runResult =>
            {
                resolve(runResult.changes);
            })
            .catch(reject);
        });

        /**@type {StatementFunction["delete"]}*/
        const deleteFunc = (parameters) => new Promise((resolve, reject) =>
        {
            wrapCall.statement.run(stmt, statementSentence(parameters)).then(runResult =>
            {
                resolve(runResult.changes);
            })
            .catch(reject);
        });

        /**@type {StatementFunction["justRun"]}*/
        const justRun = (parameters) => new Promise((resolve, reject) =>
        {
            wrapCall.statement.run(stmt, statementSentence(parameters)).then(runResult =>
            {
                resolve(runResult);
            })
            .catch(reject);
        });


        /**@type {StatementFunction}*/
        const statementFunction = Object.assign(justRun, {
            select: Object.assign(selectRows, {
                rows: selectRows,
                row: selectRow,
                celd: selectCeld,
                column: selectColumn,
            }),
            insert,
            update,
            delete: deleteFunc,
            justRun,
        });
    
        resolve(statementFunction);
    })
    .catch(reject);
});

module.exports = declareSQL;