const Options = require('../class-options');
const DB = require('../db');

/**
 * @typedef {import("./types").SqliteExpressType} SqliteExpressType
 * @typedef {import("./types").SqliteExpressClass} SqliteExpressClass
*/

/**@type {SqliteExpressClass}*/
const SqliteExpress = class
{
    /**
     * @this {SqliteExpressType}
     * @param {ConstructorParameters<SqliteExpressClass>[0]} rootPath
     */
    constructor(rootPath=process.cwd())
    {
        this.defaultOptions = new Options();
        
        this._rootPath = rootPath;

        //Fix Parameters
        Object.defineProperty(this, '_rootPath', {
            value: rootPath,
            writable: false,
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(this, 'defaultOptions', {
            value: this.defaultOptions,
            writable: false,
        });

        //Fix Options
        this.defaultOptions.fix('db');
        this.defaultOptions.fix('route');
    }

    /**
     * @type {SqliteExpressType["createDB"]}
     * @this {SqliteExpressType}
    */
    createDB(args)
    {
        const ops = new Options([args, this.defaultOptions]);
        return new DB(this, ops);
    };


    /**
     * @type {SqliteExpressType["createTable"]}
     * @this {SqliteExpressType}
    */
    createTable(args)
    {
        const ops = new Options([args, this.defaultOptions]);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.createTable(ops);
    }

    /**
     * @type {SqliteExpressType["insert"]}
     * @this {SqliteExpressType}
    */
    insert(args)
    {
        const ops = new Options([args, this.defaultOptions]);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.insert(ops);
    }
    /**
     * @type {SqliteExpressType["select"]}
     * @this {SqliteExpressType}
    */
    select(args)
    {
        const ops = new Options([args, this.defaultOptions]);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.select(ops);
    }
    /**
     * @type {SqliteExpressType["update"]}
     * @this {SqliteExpressType}
    */
    update(args)
    {
        const ops = new Options([args, this.defaultOptions]);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.update(ops);
    }
    /**
     * @type {SqliteExpressType["delete"]}
     * @this {SqliteExpressType}
    */
    delete(args)
    {
        const ops = new Options([args, this.defaultOptions]);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.delete(ops);
    }
    /**
     * @type {SqliteExpressType["exist"]}
     * @this {SqliteExpressType}
    */
    exist(args)
    {
        const ops = new Options([args, this.defaultOptions]);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.exist(ops);
    }
    /**
     * @type {SqliteExpressType["count"]}
     * @this {SqliteExpressType}
    */
    count(args)
    {
        const ops = new Options([args, this.defaultOptions]);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.count(ops);
    }
    /**
     * @type {SqliteExpressType["executeSQL"]}
     * @this {SqliteExpressType}
    */
    executeSQL(args)
    {
        const ops = new Options([args, this.defaultOptions]);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.executeSQL(ops);
    }

    /**@type {SqliteExpressType["beginTransaction"]}*/
    beginTransaction(args)
    {
        const ops = new Options([args, this.defaultOptions]);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.beginTransaction(ops);
    }

    /**@type {SqliteExpressType["rollback"]}*/
    rollback(args)
    {
        const ops = new Options([args, this.defaultOptions]);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.rollback(ops);
    }

    /**@type {SqliteExpressType["commit"]}*/
    commit(args)
    {
        const ops = new Options([args, this.defaultOptions]);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.commit(ops);
    }

    /**@type {SqliteExpressType["declareSQL"]}*/
    declareSQL(args)
    {
        const ops = new Options([args, this.defaultOptions]);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.declareSQL(ops);
    }
};

module.exports = SqliteExpress;