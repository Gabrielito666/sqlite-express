/**
 * @typedef {import("./types").DBClass} DBClass
 * @typedef {import("./types").DB} DBType
*/

const path = require( 'path' );
const sqlite3 = require('sqlite3').verbose();
const Scope = require('../scope');

/**@type {DBClass}*/
const DB = class
{
    /**
     * @this {DBType}
     * @param {ConstructorParameters<DBClass>[0]} context
     * @param {ConstructorParameters<DBClass>[1]} options
    */
    #sqliteDb;
    #scopesList = [];
    constructor(context, options)
    {
        const { route, logQuery } = options;
        if(!route) throw new Error("SqliteExpress - DB Error: The route is not defined");
        const routePath = path.resolve(context._rootPath, route);
    
        if(logQuery) console.log(`The declared database is located at: ${route}`);

        this.#sqliteDb = new sqlite3.Database(routePath);

        ['SIGINT', 'SIGTERM'].forEach(signal => {
            process.on(signal, () => {
                this.#sqliteDb.close((err) => {
                    if (err) console.error('Error closing database:', err.message);
                    process.exit(0);
                });
            });
        });
    }

    createScope()
    {
        const scope = new Scope();
        this.#scopesList.push(scope);
        scope.endPromise.then(() => {}).catch(err => {
            console.error('Unhandled error in scope:', err.message);
        }).finally(() => {
            this.#scopesList.splice(this.#scopesList.indexOf(scope), 1);
        });
        return scope;
    }

    /**
     * @type {DBType["createTable"]}
     * @this {DBType}
    */
    createTable(args)
    {
    
    }

    /**
     * @type {DBType["select"]}
     * @this {DBType}
    */
    select(args)
    {

    }

    /**
     * @type {DBType["insert"]}
     * @this {DBType}
    */
    insert(args)
    {

    }

    /**
     * @type {DBType["update"]}
     * @this {DBType}
    */
    update(args)
    {

    }

    /**
     * @type {DBType["delete"]}
     * @this {DBType}
    */
    delete(args)
    {

    }

    /**
     * @type {DBType["exist"]}
     * @this {DBType}
    */
    exist(args)
    {

    }

    /**
     * @type {DBType["count"]}
     * @this {DBType}
    */
    count(args)
    {

    }

    /**
     * @type {DBType["executeSQL"]}
     * @this {DBType}
    */
    executeSQL(args)
    {

    }

    /**@type {DBType["beginTransaction"]}*/
    beginTransaction(args)
    {

    }

    /**@type {DBType["rollback"]}*/
    rollback(args)
    {

    }

    /**@type {DBType["commit"]}*/
    commit(args)
    {
    }

    /**@type {DBType["declareSQL"]}*/
    declareSQL(args)
    {

    }
};


module.exports = DB;
