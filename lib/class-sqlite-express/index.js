const Options = require('../class-options');
const DB = require('../class-db');

/**
 * @typedef {import("../class-options/types").ExpectedParam} ExpectedParam
 * @typedef {import("./types").SqliteExpressCreateDbMethod} SqliteExpressCreateDbMethod
 * @typedef {import("./types").SqliteExpressCreateTableMethod} SqliteExpressCreateTableMethod
 * @typedef {import("./types").SqliteExpressDeleteMethod} SqliteExpressDeleteMethod
 * @typedef {import("./types").SqliteExpressExecuteSQLMethod} SqliteExpressExecuteSQLMethod
 * @typedef {import("./types").SqliteExpressExistMethod} SqliteExpressExistMethod
 * @typedef {import("./types").SqliteExpressInsertMethod} SqliteExpressInsertMethod
 * @typedef {import("./types").SqliteExpressSelectMethod<ExpectedParam>} SqliteExpressSelectMethod
 * @typedef {import("./types").SqliteExpressCountMethod} SqliteExpressCountMethod
 * @typedef {import("./types").SqliteExpressConstructorMethod} SqliteExpressConstructorMethod
 * @typedef {import("./types").SqliteExpressUpdateMethod} SqliteExpressUpdateMethod
 * @typedef {import("./types").SqliteExpressClass} SqliteExpressClass
 * @typedef {import("./types").SqliteExpressType} SqliteExpressType
*/

/**@type {SqliteExpressClass}*/
const SqliteExpress = class
{
    /**
     * @this {SqliteExpressType}
     * @type {SqliteExpressConstructorMethod}
     */
    constructor(rootPath=process.cwd())
    {
        this._rootPath =  rootPath;
        this.defaultOptions = new Options(this, this._rootPath);
    }
    
    set rootPath(value)
    {
        this._rootPath = value;
        this.defaultOptions.rootPath = value;
    }
    get rootPath()
    {
        return this._rootPath;
    }
    /**
     * @type {SqliteExpressCreateDbMethod}
     * @this {SqliteExpressType}
    */
    createDB(options)
    {
        const ops = (options || new Options(this, this._rootPath)).combination(this.defaultOptions);
        return new DB(this, ops);
    };


    /**
     * @type {SqliteExpressCreateTableMethod}
     * @this {SqliteExpressType}
    */
    createTable(options)
    {
        const ops = new Options(this, this._rootPath);
        ops.combination((options || {}), this.defaultOptions);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.createTable(ops);
    }

    /**
     * @type {SqliteExpressInsertMethod}
     * @this {SqliteExpressType}
    */
    insert(options)
    {
        const ops = new Options(this, this._rootPath);
        ops.combination((options || {}), this.defaultOptions);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.insert(ops);
    }
    /**
     * @type {SqliteExpressSelectMethod}
     * @this {SqliteExpressType}
    */
    select(options)
    {
        const ops = new Options(this, this._rootPath);
        ops.combination((options || {}), this.defaultOptions);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.select(ops);
    }
    /**
     * @type {SqliteExpressUpdateMethod}
     * @this {SqliteExpressType}
    */
    update(options)
    {
        const ops = new Options(this, this._rootPath);
        ops.combination((options || {}), this.defaultOptions);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.update(ops);
    }
    /**
     * @type {SqliteExpressDeleteMethod}
     * @this {SqliteExpressType}
    */
    delete(options)
    {
        const ops = new Options(this, this._rootPath);
        ops.combination((options || {}), this.defaultOptions);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.delete(ops);
    }
    /**
     * @type {SqliteExpressExistMethod}
     * @this {SqliteExpressType}
    */
    exist(options)
    {
        const ops = new Options(this, this._rootPath);
        ops.combination((options || {}), this.defaultOptions);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.exist(ops);
    }
    /**
     * @type {SqliteExpressCountMethod}
     * @this {SqliteExpressType}
    */
    count(options)
    {
        const ops = new Options(this, this._rootPath);
        ops.combination((options || {}), this.defaultOptions);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.count(ops);
    }
    /**
     * @type {SqliteExpressExecuteSQLMethod}
     * @this {SqliteExpressType}
    */
    executeSQL(options)
    {
        const ops = new Options(this, this._rootPath);
        ops.combination((options || {}), this.defaultOptions);
        if(!ops.db)
        {
            throw new Error("db is required");
        }
        return ops.db.executeSQL(ops);
    }
};

module.exports = SqliteExpress;