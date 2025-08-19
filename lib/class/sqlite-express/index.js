const DB = require('../db');

/**
 * @typedef {import("./types").SqliteExpress} SqliteExpressType
 * @typedef {import("./types").SqliteExpressClass} SqliteExpressClass
*/

/**@type {SqliteExpressClass}*/
const SqliteExpress = class
{
    /**
     * @this {SqliteExpressType}
     * @param {ConstructorParameters<SqliteExpressClass>[0]} args
     */
    constructor({logQuery=true}={logQuery:true})
    {
        this.logQuery = logQuery;
    }

    /**
     * @type {SqliteExpressType["createDB"]}
     * @this {SqliteExpressType}
    */
    createDB(args)
    {
        return new DB({logQuery:this.logQuery, ...args});
    };


    /**
     * @type {SqliteExpressType["createTable"]}
     * @this {SqliteExpressType}
    */
    createTable(args)
    {
        return args.db.createTable({logQuery:this.logQuery, ...args});
    }

    /**
     * @type {SqliteExpressType["insert"]}
     * @this {SqliteExpressType}
    */
    insert(args)
    {
        return args.db.insert({logQuery:this.logQuery, ...args});
    }
    /**
     * @type {SqliteExpressType["update"]}
     * @this {SqliteExpressType}
    */
    update(args)
    {
        return args.db.update({logQuery:this.logQuery, ...args});
    }
    /**
     * @type {SqliteExpressType["delete"]}
     * @this {SqliteExpressType}
    */
    delete(args)
    {
        return args.db.delete({logQuery:this.logQuery, ...args});
    }
    /**
     * @type {SqliteExpressType["exist"]}
     * @this {SqliteExpressType}
    */
    exist(args)
    {
        return args.db.exist({logQuery:this.logQuery, ...args});
    }
    /**
     * @type {SqliteExpressType["count"]}
     * @this {SqliteExpressType}
    */
    count(args)
    {
        return args.db.count({logQuery:this.logQuery, ...args});
    }

    /**@type {SqliteExpressType["rollback"]}*/
    rollback(args)
    {
        return args.db.rollback({logQuery:this.logQuery, ...args});
    }

    /**@type {SqliteExpressType["commit"]}*/
    commit(args)
    {
        return args.db.commit({logQuery:this.logQuery, ...args});
    }

    /**@type {SqliteExpressType["declareSQL"]}*/
    declareSQL(args)
    {
        return args.db.declareSQL({logQuery:this.logQuery, ...args});
    }
};


/**
 * @type {SqliteExpressType["select"]}
 * @this {SqliteExpressType}
*/
const selectImplementation = function(args)
{
    return args.db.select({logQuery:this.logQuery, ...args});
}
/**
 * @type {SqliteExpressType["select"]["rows"]}
 * @this {SqliteExpressType}
*/
selectImplementation.rows = function(args)
{
    return args.db.select.rows({logQuery:this.logQuery, ...args});
}
/**
 * @type {SqliteExpressType["select"]["row"]}
 * @this {SqliteExpressType}
*/
selectImplementation.row = function(args)
{
    return args.db.select.row({logQuery:this.logQuery, ...args});
}
/**
 * @type {SqliteExpressType["select"]["celd"]}
 * @this {SqliteExpressType}
*/
selectImplementation.celd = function(args)
{
    return args.db.select.celd({logQuery:this.logQuery, ...args});
}
/**
 * @type {SqliteExpressType["select"]["column"]}
 * @this {SqliteExpressType}
*/
selectImplementation.column = function(args)
{
    return args.db.select.column({logQuery:this.logQuery, ...args});
}

/**
 * @type {SqliteExpressType["executeSQL"]}
 * @this {SqliteExpressType}
*/
const executeSQLImplementation = function(args)
{
    return args.db.executeSQL({logQuery:this.logQuery, ...args});
}
/**
 * @type {SqliteExpressType["executeSQL"]["select"]}
 * @this {SqliteExpressType}
*/
executeSQLImplementation.select = function(args)
{
    return args.db.executeSQL.select({logQuery:this.logQuery, ...args});
}
/**
 * @type {SqliteExpressType["executeSQL"]["select"]["rows"]}
 * @this {SqliteExpressType}
*/
executeSQLImplementation.select.rows = function(args)
{
    return args.db.executeSQL.select.rows({logQuery:this.logQuery, ...args});
}
/**
 * @type {SqliteExpressType["executeSQL"]["select"]["row"]}
 * @this {SqliteExpressType}
*/
executeSQLImplementation.select.row = function(args)
{
    return args.db.executeSQL.select.row({logQuery:this.logQuery, ...args});
}
/**
 * @type {SqliteExpressType["executeSQL"]["select"]["celd"]}
 * @this {SqliteExpressType}
*/
executeSQLImplementation.select.celd = function(args)
{
    return args.db.executeSQL.select.celd({logQuery:this.logQuery, ...args});
}
/**
 * @type {SqliteExpressType["executeSQL"]["select"]["column"]}
 * @this {SqliteExpressType}
*/
executeSQLImplementation.select.column = function(args)
{
    return args.db.executeSQL.select.column({logQuery:this.logQuery, ...args});
}
/**
 * @type {SqliteExpressType["executeSQL"]["insert"]}
 * @this {SqliteExpressType}
*/
executeSQLImplementation.insert = function(args)
{
    return args.db.executeSQL.insert({logQuery:this.logQuery, ...args});
}
/**
 * @type {SqliteExpressType["executeSQL"]["update"]}
 * @this {SqliteExpressType}
*/
executeSQLImplementation.update = function(args)
{
    return args.db.executeSQL.update({logQuery:this.logQuery, ...args});
}
/**
 * @type {SqliteExpressType["executeSQL"]["delete"]}
 * @this {SqliteExpressType}
*/
executeSQLImplementation.delete = function(args)
{
    return args.db.executeSQL.delete({logQuery:this.logQuery, ...args});
}
/**
 * @type {SqliteExpressType["executeSQL"]["justRun"]}
 * @this {SqliteExpressType}
*/
executeSQLImplementation.justRun = function(args)
{
    return args.db.executeSQL.justRun({logQuery:this.logQuery, ...args});
}

/**
 * @type {SqliteExpressType["begin"]}
 * @this {SqliteExpressType}
*/
const beginImplementation = function(args)
{
    return args.db.begin({logQuery:this.logQuery, ...args});
}
/**
 * @type {SqliteExpressType["begin"]["transaction"]}
 * @this {SqliteExpressType}
*/
beginImplementation.transaction = function(args)
{
    return args.db.begin.transaction({logQuery:this.logQuery, ...args});
}
/**
 * @type {SqliteExpressType["begin"]["deferredTransaction"]}
 * @this {SqliteExpressType}
*/
beginImplementation.deferredTransaction = function(args)
{
    return args.db.begin.deferredTransaction({logQuery:this.logQuery, ...args});
}
/**
 * @type {SqliteExpressType["begin"]["immediateTransaction"]}
 * @this {SqliteExpressType}
*/
beginImplementation.immediateTransaction = function(args)
{
    return args.db.begin.immediateTransaction({logQuery:this.logQuery, ...args});
}
/**
 * @type {SqliteExpressType["begin"]["exclusiveTransaction"]}
 * @this {SqliteExpressType}
*/
beginImplementation.exclusiveTransaction = function(args)
{
    return args.db.begin.exclusiveTransaction({logQuery:this.logQuery, ...args});
}

SqliteExpress.prototype.select = selectImplementation;
SqliteExpress.prototype.executeSQL = executeSQLImplementation;
SqliteExpress.prototype.begin = beginImplementation;

module.exports = SqliteExpress;