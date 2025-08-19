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
const begin = require("../../functions/begin-transaction");
const rollback = require("../../functions/rollback");
const commit = require("../../functions/commit");
const declareSQL = require("../../functions/declare-sql");
const wrapCall = require('../../tools/wrap-call');
const Table = require('../table');

/**
 * @typedef {import("./types").DBClass} DBClass
 * @typedef {import("./types").DB} DBType
*/

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
     * @type {DBClass["awaitBeforeFunctions"]}
    */
    static awaitBeforeFunctions(db)
    {
        return Promise.all(DB.getPrivate(db).awaitersList).then(() => db);
    }

    /**
     * @type {DBClass["awaitBeforeFunctionsAndScopeStart"]}
    */
    static awaitBeforeFunctionsAndScopeStart(db, scope)
    {
        const { scopesQueue } = DB.getPrivate(db);
        return Promise.all([DB.awaitBeforeFunctions(db), ScopesQueue.awaitScopeStart(scope, scopesQueue)]);
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
        privateCamps.awaitersList = /**@type {Promise<void>[]}*/([]);
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
     * @type {DBType["addBeforeFunction"]}
     * @this {DBType}
    */
    addBeforeFunction(func)
    {
        const promise = func instanceof Promise ? func : func();
        DB.getPrivate(this).awaitersList.push(promise);
        
        return promise.finally(() => {
            const index = DB.getPrivate(this).awaitersList.indexOf(promise);
            if(index !== -1) DB.getPrivate(this).awaitersList.splice(index, 1);
        });
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
        return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope)
        .then(() =>
        {
            return createTable(DB.getPrivate(this).sqliteDb, {logQuery:this.logQuery, ...args})
            .then(table =>
            {
                DB.getPrivate(this).tablesMap.set(args.tableName, table);
                return table;
            })
        })
    }
    
    /**
     * @type {DBType["insert"]}
     * @this {DBType}
    */
    insert(args)
    {
        return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
        {
            return insert(DB.getPrivate(this).sqliteDb, {logQuery:this.logQuery, ...args});
        })
    }

    /**
     * @type {DBType["update"]}
     * @this {DBType}
    */
    update(args)
    {
        return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
        {
            return update(DB.getPrivate(this).sqliteDb, {logQuery:this.logQuery, ...args});
        })
    }

    /**
     * @type {DBType["delete"]}
     * @this {DBType}
    */
    delete(args)
    {
        return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
        {
            return deleteFn(DB.getPrivate(this).sqliteDb, {logQuery:this.logQuery, ...args});
        })
    }

    /**
     * @type {DBType["exist"]}
     * @this {DBType}
    */
    exist(args)
    {
        return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
        {
            return exist(DB.getPrivate(this).sqliteDb, {logQuery:this.logQuery, ...args});
        })
    }

    /**
     * @type {DBType["count"]}
     * @this {DBType}
    */
    count(args)
    {
        return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
        {
            return count(DB.getPrivate(this).sqliteDb, {logQuery:this.logQuery, ...args});
        })
    }

    /**
     * @type {DBType["declareSQL"]}
     * @this {DBType}
    */
    declareSQL(args)
    {
        const { sqliteDb } = DB.getPrivate(this);
        return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
        {
            return declareSQL(sqliteDb, {logQuery:this.logQuery, ...args});
        })
    }

    /**
     * @type {DBType["rollback"]}
     * @this {DBType}
    */
    rollback(args)
    {
        const { rollbackStamentPromise } = DB.getPrivate(this);
        return rollbackStamentPromise.then(stmt =>
        {
            return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
            {
                return rollback(stmt, {logQuery:this.logQuery, ...args});
            })
        });
    }

    /**
     * @type {DBType["commit"]}
     * @this {DBType}
    */
    commit(args)
    {
        const { commitStamentPromise } = DB.getPrivate(this);
        return commitStamentPromise.then(stmt =>
        {
            return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
            {
                return commit(stmt, {logQuery:this.logQuery, ...args});
            })
        });
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
};

/**
 * @type {DBType["select"]}
 * @this {DBType}
*/
const selectImplementation = function(args)
{
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return select(DB.getPrivate(this).sqliteDb, {logQuery:this.logQuery, ...args});
    })
};

/**
 * @type {DBType["select"]["rows"]}
 * @this {DBType}
*/
selectImplementation.rows = function(args)
{
    const { sqliteDb } = DB.getPrivate(this);
    
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return select.rows(sqliteDb, {logQuery:this.logQuery, ...args});
    })
};
/**
 * @type {DBType["select"]["row"]}
 * @this {DBType}
*/
selectImplementation.row = function(args)
{
    const { sqliteDb } = DB.getPrivate(this);
    
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return select.row(sqliteDb, {logQuery:this.logQuery, ...args});
    })
};
/**
 * @type {DBType["select"]["column"]}
 * @this {DBType}
*/
selectImplementation.column = function(args)
{
    const { sqliteDb } = DB.getPrivate(this);
    
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return select.column(sqliteDb, {logQuery:this.logQuery, ...args});
    })
};
/**
 * @type {DBType["select"]["celd"]}
 * @this {DBType}
*/
selectImplementation.celd = function(args)
{
    const { sqliteDb } = DB.getPrivate(this);
    
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return select.celd(sqliteDb, {logQuery:this.logQuery, ...args});
    })
};

/**
* @type {DBType["executeSQL"]}
* @this {DBType}
*/
const executeSQLImplementation = function(args)
{
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return executeSQL(DB.getPrivate(this).sqliteDb, {logQuery:this.logQuery, ...args});
    })
}


/**
 * @type {DBType["executeSQL"]["select"]}
 * @this {DBType}
*/
executeSQLImplementation.select = function(args)
{
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return executeSQL.select(DB.getPrivate(this).sqliteDb, {logQuery:this.logQuery, ...args});
    })
};

/**
 * @type {DBType["executeSQL"]["select"]["rows"]}
 * @this {DBType}
*/
executeSQLImplementation.select.rows = function(args)
{
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return executeSQL.select.rows(DB.getPrivate(this).sqliteDb, {logQuery:this.logQuery, ...args});
    })
};

/**
 * @type {DBType["executeSQL"]["select"]["row"]}
 * @this {DBType}
*/
executeSQLImplementation.select.row = function(args)
{
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return executeSQL.select.row(DB.getPrivate(this).sqliteDb, {logQuery:this.logQuery, ...args});
    })
};

/**
 * @type {DBType["executeSQL"]["select"]["column"]}
 * @this {DBType}
*/
executeSQLImplementation.select.column = function(args)
{
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return executeSQL.select.column(DB.getPrivate(this).sqliteDb, {logQuery:this.logQuery, ...args});
    })
};

/**
 * @type {DBType["executeSQL"]["select"]["celd"]}
 * @this {DBType}
*/
executeSQLImplementation.select.celd = function(args)
{
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return executeSQL.select.celd(DB.getPrivate(this).sqliteDb, {logQuery:this.logQuery, ...args});
    })
};

/**
 * @type {DBType["executeSQL"]["insert"]}
 * @this {DBType}
*/
executeSQLImplementation.insert = function(args)
{
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return executeSQL.insert(DB.getPrivate(this).sqliteDb, {logQuery:this.logQuery, ...args});
    })
};
/**
 * @type {DBType["executeSQL"]["update"]}
 * @this {DBType}
*/
executeSQLImplementation.update = function(args)
{
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return executeSQL.update(DB.getPrivate(this).sqliteDb, {logQuery:this.logQuery, ...args});
    })
};
/**
 * @type {DBType["executeSQL"]["delete"]}
 * @this {DBType}
*/
executeSQLImplementation.delete = function(args)
{
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return executeSQL.delete(DB.getPrivate(this).sqliteDb, {logQuery:this.logQuery, ...args});
    })
};
/**
 * @type {DBType["executeSQL"]["justRun"]}
 * @this {DBType}
*/
executeSQLImplementation.justRun = function(args)
{
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return executeSQL.justRun(DB.getPrivate(this).sqliteDb, {logQuery:this.logQuery, ...args});
    })
};

/**
 * @type {DBType["begin"]}
 * @this {DBType}
*/
const beginImplementation = function(args)
{
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return DB.getPrivate(this).beginDefferredTransactionStamentPromise.then(stmt =>
        {
            return begin(stmt, {logQuery:this.logQuery, ...args});
        })
    })
}

/**
 * @type {DBType["begin"]["transaction"]}
 * @this {DBType}
*/
beginImplementation.transaction = function(args)
{
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return DB.getPrivate(this).beginDefferredTransactionStamentPromise.then(stmt =>
        {
            return begin.transaction(stmt, {logQuery:this.logQuery, ...args});
        })
    })
}
/**
 * @type {DBType["begin"]["deferredTransaction"]}
 * @this {DBType}
*/
beginImplementation.deferredTransaction = function(args)
{
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return DB.getPrivate(this).beginDefferredTransactionStamentPromise.then(stmt =>
        {
            return begin.deferredTransaction(stmt, {logQuery:this.logQuery, ...args});
        })
    })
}

/**
 * @type {DBType["begin"]["immediateTransaction"]}
 * @this {DBType}
*/
beginImplementation.immediateTransaction = function(args)
{
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return DB.getPrivate(this).beginImmediateTransactionStamentPromise.then(stmt =>
        {
            return begin.immediateTransaction(stmt, {logQuery:this.logQuery, ...args});
        })
    })
}
/**
 * @type {DBType["begin"]["exclusiveTransaction"]}
 * @this {DBType}
*/
beginImplementation.exclusiveTransaction = function(args)
{
    return DB.awaitBeforeFunctionsAndScopeStart(this, args.scope).then(() =>
    {
        return DB.getPrivate(this).beginExclusiveTransactionStamentPromise.then(stmt =>
        {
            return begin.exclusiveTransaction(stmt, {logQuery:this.logQuery, ...args});
        })
    })
}


DB.prototype.select = selectImplementation;
DB.prototype.executeSQL = executeSQLImplementation;
DB.prototype.begin = beginImplementation;

module.exports = DB;