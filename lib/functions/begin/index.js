const consoleQuery = require("../../tools/console-query");
const wrapCall = require("../../tools/wrap-call");

/**@typedef {import("./types").BeginFunction} BeginFunction */


/**@type {BeginFunction}*/

/**@type {BeginFunction["deferredTransaction"]}*/
const beginDeferredTransaction = function(sqliteBeginDeferredTransactionStmt, {logQuery=true}={logQuery:true})
{
    return new Promise((resolve, reject) =>
    {
        wrapCall.statement.run(sqliteBeginDeferredTransactionStmt, [])
        .then(() =>
        {
            if (logQuery)
            {
                consoleQuery("BEGIN DEFERRED TRANSACTION");
            }
            resolve(true);
        })
        .catch(reject);
    })
};
  
/**@type {BeginFunction["immediateTransaction"]}*/
const beginImmediateTransaction = function(sqliteBeginImmediateTransactionStmt, {logQuery=true}={logQuery:true})
{
    return new Promise((resolve, reject) =>
    {
        wrapCall.statement.run(sqliteBeginImmediateTransactionStmt, []).then(() =>
        {
            if (logQuery)
            {
                consoleQuery("BEGIN IMMEDIATE TRANSACTION");
            }
            resolve(true);
        })
        .catch(reject);
    })
};
  
/**@type {BeginFunction["exclusiveTransaction"]}*/
const beginExclusiveTransaction = function(sqliteBeginExclusiveTransactionStmt, {logQuery=true}={logQuery:true})
{
    return new Promise((resolve, reject) =>
    {
        wrapCall.statement.run(sqliteBeginExclusiveTransactionStmt, []).then(() =>
        {
            if (logQuery)
            {
                consoleQuery("BEGIN EXCLUSIVE TRANSACTION");
            }
            resolve(true);
        })
        .catch(reject);
    })
};

/**@type {BeginFunction}*/
const begin = Object.assign(beginDeferredTransaction, {
    transaction: beginDeferredTransaction,
    deferredTransaction: beginDeferredTransaction,
    immediateTransaction: beginImmediateTransaction,
    exclusiveTransaction: beginExclusiveTransaction
});

module.exports = begin;