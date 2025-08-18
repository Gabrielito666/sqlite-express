const consoleQuery = require("../../tools/console-query");
const normalizeParameters = require("../../tools/normalize-parameters");
const pathOrSql = require("../../tools/path-or-sql");
const wrapCall = require("../../tools/wrap-call");

/**
 * @typedef {import("./types").ExecuteSQLFunction} ExecuteSQLFunction
 * @typedef {import("./types").ExecuteSQLSentence} ExecuteSQLSentence
*/

/**@type {ExecuteSQLSentence}*/
const executeSqlSentence = ({query, parameters, logQuery=true}) =>
{
    if (logQuery) consoleQuery(query, parameters);
    return {finalQuery: pathOrSql(query), normalizedParams: normalizeParameters(parameters)};
};

/**@type {ExecuteSQLFunction["justRun"]}*/
const justRun = (sqliteDb, {query, parameters, logQuery=true}) => new Promise((resolve, reject) =>
{
    const {finalQuery, normalizedParams} = executeSqlSentence({query, parameters, logQuery});
    wrapCall.run(sqliteDb, finalQuery, normalizedParams).then(runResult =>
    {
        resolve(runResult);
    })
    .catch(reject);
});

/**@type {ExecuteSQLFunction["select"]["rows"]}*/
const selectRows = (sqliteDb, {query, parameters, logQuery=true}) => new Promise((resolve, reject) =>
{
    const {finalQuery, normalizedParams} = executeSqlSentence({query, parameters, logQuery});
    wrapCall.all(sqliteDb, finalQuery, normalizedParams).then(rows =>
    {
        resolve(rows);
    })
    .catch(reject);
});

/**@type {ExecuteSQLFunction["select"]["row"]}*/
const selectRow = (sqliteDb, {query, parameters, logQuery=true}) => new Promise((resolve, reject) =>
{
    const {finalQuery, normalizedParams} = executeSqlSentence({query, parameters, logQuery});
    wrapCall.get(sqliteDb, finalQuery, normalizedParams).then(row =>
    {
        resolve(row);
    })
    .catch(reject);
});

/**@type {ExecuteSQLFunction["select"]["celd"]}*/
const selectCeld = (sqliteDb, {query, parameters, logQuery=true}) => new Promise((resolve, reject) =>
{
    const {finalQuery, normalizedParams} = executeSqlSentence({query, parameters, logQuery});
    wrapCall.get(sqliteDb, finalQuery, normalizedParams).then(row =>
    {
        resolve(Object.values(row || {})[0] || null);
    })
    .catch(reject);
});

/**@type {ExecuteSQLFunction["select"]["column"]}*/
const selectColumn = (sqliteDb, {query, parameters, logQuery=true}) => new Promise((resolve, reject) =>
{
    const {finalQuery, normalizedParams} = executeSqlSentence({query, parameters, logQuery});
    wrapCall.all(sqliteDb, finalQuery, normalizedParams).then(rows =>
    {
        resolve(rows.map(row => Object.values(row || {})[0] || null));
    })
    .catch(reject);
});

/**@type {ExecuteSQLFunction["insert"]}*/
const insert = (sqliteDb, {query, parameters, logQuery=true}) => new Promise((resolve, reject) =>
{
    const {finalQuery, normalizedParams} = executeSqlSentence({query, parameters, logQuery});
    wrapCall.run(sqliteDb, finalQuery, normalizedParams).then(runResult =>
    {
        resolve(runResult.lastID);
    })
    .catch(reject);
});

/**@type {ExecuteSQLFunction["update"]}*/
const update = (sqliteDb, {query, parameters, logQuery=true}) => new Promise((resolve, reject) =>
{
    const {finalQuery, normalizedParams} = executeSqlSentence({query, parameters, logQuery});
    wrapCall.run(sqliteDb, finalQuery, normalizedParams).then(runResult =>
    {
        resolve(runResult.changes);
    })
    .catch(reject);
});

/**@type {ExecuteSQLFunction["delete"]}*/
const deleteFunc = (sqliteDb, {query, parameters, logQuery=true}) => new Promise((resolve, reject) =>
{
    const {finalQuery, normalizedParams} = executeSqlSentence({query, parameters, logQuery});
    wrapCall.run(sqliteDb, finalQuery, normalizedParams).then(runResult =>
    {
        resolve(runResult.changes);
    })
    .catch(reject);
});

/**@type {ExecuteSQLFunction}*/
const executeSQL = Object.assign(justRun, {
    select: Object.assign(selectRows, {
        rows: selectRows,
        row: selectRow,
        celd: selectCeld,
        column: selectColumn,
    }),
    justRun,
    insert,
    update,
    delete: deleteFunc,
});

/**@type {ExecuteSQLFunction}*/
module.exports = executeSQL;