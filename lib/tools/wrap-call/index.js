

/**@typedef {import("./types").WrapCall} WrapCall */

const wrapCall = {};

/**@type {WrapCall["run"]} */
wrapCall.run = (sqliteDb, query, parameters) => new Promise((resolve, reject) =>
{
    sqliteDb.run(query, parameters, function(err)
    {
        if(err) reject(err);
        else resolve(this);
    });
});

/**@type {WrapCall["get"]} */
wrapCall.get = (sqliteDb, query, parameters) => new Promise((resolve, reject) =>
{
    sqliteDb.get(query, parameters, function(err, row)
    {
        if(err) reject(err);
        else resolve(row);
    });
});

/**@type {WrapCall["all"]} */
wrapCall.all = (sqliteDb, query, parameters) => new Promise((resolve, reject) =>
{
    sqliteDb.all(query, parameters, function(err, rows)
    {
        if(err) reject(err);
        else resolve(rows);
    });
});

/**@type {WrapCall["prepare"]} */
wrapCall.prepare = (sqliteDb, query) => new Promise((resolve, reject) =>
{
    sqliteDb.prepare(query, function(err)
    {
        if(err) reject(err);
        else resolve(this);
    });
});

/**@type {WrapCall["statement"]} */
wrapCall.statement = {};

/**@type {WrapCall["statement"]["run"]} */
wrapCall.statement.run = (statement, parameters) => new Promise((resolve, reject) =>
{
    statement.run(parameters, function(err)
    {
        if(err) reject(err);
        else resolve(this);
    });
});

/**@type {WrapCall["statement"]["get"]} */
wrapCall.statement.get = (statement, parameters) => new Promise((resolve, reject) =>
{
    statement.get(parameters, function(err, row)
    {
        if(err) reject(err);
        else resolve(row);
    });
});

/**@type {WrapCall["statement"]["all"]} */
wrapCall.statement.all = (statement, parameters) => new Promise((resolve, reject) =>
{
    statement.all(parameters, function(err, rows)
    {
        if(err) reject(err);
        else resolve(rows);
    });
});

/**@type {WrapCall} */
module.exports = wrapCall;