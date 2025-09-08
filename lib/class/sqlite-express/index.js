const DB = require('../db');

/**
 * @typedef {import("./types").SqliteExpress} SqliteExpressType
 * @typedef {import("./types").SqliteExpressClass} SqliteExpressClass
*/

/**@type {SqliteExpressClass}*/
const SqliteExpress = class
{
    static get DB(){ return DB };
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

    get select()
    {
        /** @type {SqliteExpressType["select"]}*/
        const mainSelect = args => args.db.select({logQuery: this.logQuery, ...args});

        mainSelect.rows = args => args.db.select.rows({logQuery: this.logQuery, ...args});
        mainSelect.row = args => args.db.select.row({logQuery: this.logQuery, ...args});
        mainSelect.column = args => args.db.select.column({logQuery: this.logQuery, ...args});
        mainSelect.celd = args => args.db.select.celd({logQuery: this.logQuery, ...args});

        return mainSelect;
    }
    get executeSQL()
    {
        /** @type {SqliteExpressType["executeSQL"]}*/
        const mainExecuteSQL = args => args.db.executeSQL({logQuery:this.logQuery, ...args});
        /** @type {SqliteExpressType["executeSQL"]["select"]}*/
        mainExecuteSQL.select = args => args.db.executeSQL.select({logQuery:this.logQuery, ...args});
        /** @type {SqliteExpressType["executeSQL"]["select"]["rows"]}*/
        mainExecuteSQL.select.rows = args => args.db.executeSQL.select.rows({logQuery:this.logQuery, ...args});
        /** @type {SqliteExpressType["executeSQL"]["select"]["row"]}*/
        mainExecuteSQL.select.row = args => args.db.executeSQL.select.row({logQuery:this.logQuery, ...args});
        /** @type {SqliteExpressType["executeSQL"]["select"]["column"]}*/
        mainExecuteSQL.select.column = args => args.db.executeSQL.select.column({logQuery:this.logQuery, ...args});
        /** @type {SqliteExpressType["executeSQL"]["select"]["celd"]}*/
        mainExecuteSQL.select.celd = args => args.db.executeSQL.select.celd({logQuery:this.logQuery, ...args});

        mainExecuteSQL.insert = args => args.db.executeSQL.insert({logQuery:this.logQuery, ...args});
        mainExecuteSQL.update = args => args.db.executeSQL.update({logQuery:this.logQuery, ...args});
        mainExecuteSQL.delete = args => args.db.executeSQL.delete({logQuery:this.logQuery, ...args});
        mainExecuteSQL.justRun = args => args.db.executeSQL.justRun({logQuery:this.logQuery, ...args});

        return mainExecuteSQL;
    }
    get begin()
    {
        /**@type {SqliteExpressType["begin"]}*/
        const mainBegin = args => args.db.begin({logQuery:this.logQuery, ...args});
        mainBegin.transaction = args => args.db.begin.transaction({logQuery:this.logQuery, ...args});
        mainBegin.deferredTransaction = args => args.db.begin.deferredTransaction({logQuery:this.logQuery, ...args});
        mainBegin.immediateTransaction = args => args.db.begin.immediateTransaction({logQuery:this.logQuery, ...args});
        mainBegin.exclusiveTransaction = args => args.db.begin.exclusiveTransaction({logQuery:this.logQuery, ...args});
        
        return mainBegin;
    }
};

module.exports = SqliteExpress;