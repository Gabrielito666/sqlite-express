const sqlite3 = require('sqlite3').verbose();
const ScopesQueue = require('../scopes-queue');

//METHODS
const createTable = require("../../functions/create-table");
const select = require("../../functions/select");
const insert = require("../../functions/insert");
const update = require("../../functions/update");
const deleteFn = require("../../functions/delete");
const exist = require("../../functions/exist");
const count = require("../../functions/count");
const executeSQL = require("../../functions/execute-sql");
const begin = require("../../functions/begin");
const rollback = require("../../functions/rollback");
const commit = require("../../functions/commit");
const declareSQL = require("../../functions/declare-sql");
const wrapCall = require('../../tools/wrap-call');
const Table = require('../table');

/**
 * @typedef {import("./types").DBClass} DBClass
 * @typedef {import("./types").DB} DBType
 * @typedef {import("sqlite3").Statement} Statement
 * @typedef {import("./types").SimpleMethodWrap} SimpleMethodWrap
 * @typedef {import("./types").StmtMethodWrap} StmtMethodWrap
*/

//==================================================
//WRAPERS
//==================================================
/**
 * @type {SimpleMethodWrap}
 * @this {DBType}
 */
const simpleMethodWrap = function(method)
{
    return (args) =>
    {
        const { sqliteDb, scopesQueue } = DB.getPrivate(this);
        
        const scope = scopesQueue.getScopeByArgs(args.scope);

        return ScopesQueue.Scope
        .getPrivate(scope)
        .addOperation(method, sqliteDb, {logQuery : this.logQuery, ...args});
    }
};

/**
 * @type {StmtMethodWrap}
 * @this {DBType}
 */
const stmtMethodWrap = function(method, stmtKey)
{
    return (args) =>
    {
        const { [stmtKey]: stmtPromise, scopesQueue } = DB.getPrivate(this);

        const scope = scopesQueue.getScopeByArgs(args.scope);

        return stmtPromise.then(stmt =>
        {
            return ScopesQueue.Scope
            .getPrivate(scope)
            .addOperation(method, stmt, {logQuery: this.logQuery, ...args});
        });
    }
}

/**@type {DBClass}*/
const DB = class
{
    /**@type {DBClass["private"]} */
    static private = new WeakMap();
    /**@type {DBClass["getPrivate"]} */
    static getPrivate(db)
    {   
        const pc = DB.private.get(db);
        if(!pc) throw new Error('SqliteExpress - DB Error: The private camps are not defined, this is so strange');
        return pc;
    }
    /**@type {DBClass["setPrivate"]} */
    static setPrivate(db, pc)
    {
        if(DB.private.has(db)) throw new Error('SqliteExpress - DB Error: The private camps are already defined');
        DB.private.set(db, pc);
    }

    /**
     * @this {DBType}
     * @param {ConstructorParameters<DBClass>[0]} args
    */
    constructor({route, logQuery=true})
    {
        this.logQuery = logQuery;
        if(!route) throw new Error("SqliteExpress - DB Error: The route is not defined");

        if(logQuery) console.log(`The declared database is located at: ${route}`);

        const privateCamps = {};

        privateCamps.sqliteDb = new sqlite3.Database(route);
        privateCamps.scopesQueue = new ScopesQueue();
        privateCamps.beginDefferredTransactionStamentPromise = wrapCall.prepare(privateCamps.sqliteDb, "BEGIN DEFERRED TRANSACTION;");
        privateCamps.beginImmediateTransactionStamentPromise = wrapCall.prepare(privateCamps.sqliteDb, "BEGIN IMMEDIATE TRANSACTION;");
        privateCamps.beginExclusiveTransactionStamentPromise = wrapCall.prepare(privateCamps.sqliteDb, "BEGIN EXCLUSIVE TRANSACTION;");
        privateCamps.rollbackStamentPromise = wrapCall.prepare(privateCamps.sqliteDb, "ROLLBACK;");
        privateCamps.commitStamentPromise = wrapCall.prepare(privateCamps.sqliteDb, "COMMIT;");
        privateCamps.tablesMap = /**@type {Map<string, Table>}*/(new Map());

        DB.setPrivate(this, privateCamps);
    }
    /**
     * @type {DBType["createScope"]}
     * @this {DBType}
    */
    createScope()
    {
        return DB.getPrivate(this).scopesQueue.newScope();
    }

    /**
     * @type {DBType["getTable"]}
     * @this {DBType}
    */
    getTable(tableName)
    {
        const table = DB.getPrivate(this).tablesMap.get(tableName);
        if(table)
        {
            return table;
        }
        else
        {
            const newTable = new Table(tableName, this);
            DB.getPrivate(this).tablesMap.set(tableName, newTable);
            return newTable;   
        }
    }
    /**
     * @type {DBType["createTable"]}
     * @this {DBType}
    */
    createTable(args)
    {

        return simpleMethodWrap.bind(this)(createTable)(args).then(table =>
        {
            DB.getPrivate(this).tablesMap.set(args.tableName, table);
            return table;
        });
    }
    
    /**
     * @type {DBType["insert"]}
     * @this {DBType}
    */
    insert(args)
    {
        return simpleMethodWrap.bind(this)(insert)(args);
    }

    /**
     * @type {DBType["update"]}
     * @this {DBType}
    */
    update(args)
    {
        return simpleMethodWrap.bind(this)(update)(args);
    }

    /**
     * @type {DBType["delete"]}
     * @this {DBType}
    */
    delete(args)
    {
        return simpleMethodWrap.bind(this)(deleteFn)(args);
    }

    /**
     * @type {DBType["exist"]}
     * @this {DBType}
    */
    exist(args)
    {
        return simpleMethodWrap.bind(this)(exist)(args);
    }

    /**
     * @type {DBType["count"]}
     * @this {DBType}
    */
    count(args)
    {
        return simpleMethodWrap.bind(this)(count)(args);
    }

    /**
     * @type {DBType["declareSQL"]}
     * @this {DBType}
    */
    declareSQL(args)
    {
        return simpleMethodWrap.bind(this)(declareSQL)(args);
    }

    /**
     * @type {DBType["rollback"]}
     * @this {DBType}
    */
    rollback(args)
    {
        return stmtMethodWrap.bind(this)(rollback, "rollbackStamentPromise")(args);
    }

    /**
     * @type {DBType["commit"]}
     * @this {DBType}
    */
    commit(args)
    {
        return stmtMethodWrap.bind(this)(commit, "commitStamentPromise")(args);
    }

    /**
     * @type {DBType["close"]}
     * @this {DBType}
    */
    close()
    {
        return new Promise((resolve, reject) =>
        {
            const { scopesQueue, sqliteDb } = DB.getPrivate(this);
            scopesQueue.close()
            .then(() => {

                const {
                    beginDefferredTransactionStamentPromise,
                    beginExclusiveTransactionStamentPromise,
                    beginImmediateTransactionStamentPromise,
                    commitStamentPromise,
                    rollbackStamentPromise
                } = DB.getPrivate(this);

                return Promise.all(/**@type {Promise<Statement>[]}*/([
                    beginDefferredTransactionStamentPromise,
                    beginExclusiveTransactionStamentPromise,
                    beginImmediateTransactionStamentPromise,
                    commitStamentPromise,
                    rollbackStamentPromise
                ]))
            })
            .then(stmtArr =>
            {
                const finalizePromises = stmtArr.map(s => new Promise((res, rej) =>
                {
                    s.finalize((err) =>
                    {
                        if(err) rej(err);
                        else res(void 0);
                    })
                }));

                return Promise.all(finalizePromises)
            })
            .then(() =>
            {
                sqliteDb.close((err) =>
                {
                    if (err)
                    {
                        console.error('Error closing database:', err.message);
                    }
                    else
                    {
                        resolve(void 0);
                    }
                });
            })
            .catch(reject);
        });
    }

    get select()
    {
        /**@type {DBType["select"]}*/
        const mainSelect = args => simpleMethodWrap.bind(this)(select)(args);
        mainSelect.rows = simpleMethodWrap.bind(this)(select.rows);
        mainSelect.row = simpleMethodWrap.bind(this)(select.row);
        mainSelect.column = simpleMethodWrap.bind(this)(select.column);
        mainSelect.celd = simpleMethodWrap.bind(this)(select.celd);

        return mainSelect;
    }

    get executeSQL()
    {
        /**@type {DBType["executeSQL"]}*/
        const mainExecuteSql = args => simpleMethodWrap.bind(this)(executeSQL)(args);
        mainExecuteSql.insert = simpleMethodWrap.bind(this)(executeSQL.insert);
        mainExecuteSql.delete = simpleMethodWrap.bind(this)(executeSQL.delete);
        mainExecuteSql.update = simpleMethodWrap.bind(this)(executeSQL.update);
        mainExecuteSql.justRun = simpleMethodWrap.bind(this)(executeSQL.justRun);
        /**@type {DBType["executeSQL"]["select"]}*/
        mainExecuteSql.select = args => simpleMethodWrap.bind(this)(executeSQL.select)(args);
        mainExecuteSql.select.rows = simpleMethodWrap.bind(this)(executeSQL.select.rows);
        mainExecuteSql.select.row = simpleMethodWrap.bind(this)(executeSQL.select.row);
        mainExecuteSql.select.column = simpleMethodWrap.bind(this)(executeSQL.select.column);
        mainExecuteSql.select.celd = simpleMethodWrap.bind(this)(executeSQL.select.celd);

        return mainExecuteSql;
    }
    get begin()
    {
        /**@type {DBType["begin"]}*/
        const mainBegin = args => stmtMethodWrap.bind(this)(begin, "beginDefferredTransactionStamentPromise")(args);
        mainBegin.transaction = stmtMethodWrap.bind(this)(begin.transaction, "beginDefferredTransactionStamentPromise");
        mainBegin.deferredTransaction = stmtMethodWrap.bind(this)(begin.deferredTransaction, "beginDefferredTransactionStamentPromise");
        mainBegin.immediateTransaction = stmtMethodWrap.bind(this)(begin.immediateTransaction, "beginImmediateTransactionStamentPromise");
        mainBegin.exclusiveTransaction = stmtMethodWrap.bind(this)(begin.exclusiveTransaction, "beginExclusiveTransactionStamentPromise");

        return mainBegin;
    }
};

module.exports = DB;