const Options = require('../class-options');

const createTableFunc = require('../function-create-table');
const insertFunc = require("../function-insert");
const selectFunc = require("../function-select");
const updateFunc = require("../function-update");
const deleteFunc = require("../function-delete");
const existFunc = require("../function-exist");
const countFunc = require("../function-count");
const executeSQLFunc = require("../function-execute-sql");

/**
 * @typedef {import("./types").GetDbMethod} GetDbMethod
 * @typedef {import("./types").CountMethod} CountMethod
 * @typedef {import("./types").CreateDbMethod} CreateDbMethod
 * @typedef {import("./types").CreateTableMethod} CreateTableMethod
 * @typedef {import("./types").DeleteMethod} DeleteMethod
 * @typedef {import("./types").ExecuteSQLMethod} ExecuteSQLMethod
 * @typedef {import("./types").ExistMethod} ExistMethod
 * @typedef {import("./types").InsertMethod} InsertMethod
 * @typedef {import("./types").SelectMethod} SelectMethod
 * @typedef {import("./types").SqliteExpressConstructorMethod} SqliteExpressConstructorMethod
 * @typedef {import("./types").UpdateMethod} UpdateMethod
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
        this._dataBasesList = {};
        this._rootPath =  rootPath;
        this.defaultOptions = new Options(this, this._rootPath);
    }

    set rootPath(value)
    {
        this._rootPath = value;
        this.defaultOptions.rootPath = value;
    }
    get rootPath(){ return this._rootPath };
    /**
     * This function creates a sqlite database
     * @type {CreateDbMethod}
    */
    createDB(params={})
    {
       
    };

    /**@type {GetDbMethod}*/
    getDb(dbKey=this.defaultOptions.db)
    {
        if(!Object.keys(this._dataBasesList).includes(dbKey))
        {
            throw new Error('The database you have entered is not defined');
        }
        return this._dataBasesList[dbKey];
    }

    /**@type {CreateTableMethod}*/
    createTable(params={})
    {
        const
        {
            db=this.defaultOptions.db,
            table=this.defaultOptions.table,
            columns=this.defaultOptions.columns,
            logQuery=this.defaultOptions.logQuery
        } = params;

        return this.getDb(db).addOperation(createTableFunc, { table, columns, logQuery });
    }

    /**@type {InsertMethod}*/
    insert(params={})
    {
        const
        {
            db=this.defaultOptions.db,
            table=this.defaultOptions.table,
            row=this.defaultOptions.row,
            logQuery=this.defaultOptions.logQuery
        } = params;
        
        return this.getDb(db).addOperation(insertFunc, { table, row, logQuery });
    }
    /**@type {SelectMethod}*/
    select(params={})
    {
        const
        {
            db=this.defaultOptions.db,
            table=this.defaultOptions.table,
            select=this.defaultOptions.select,
            where=this.defaultOptions.where,
            connector=this.defaultOptions.connector,
            logQuery=this.defaultOptions.logQuery,
            expected=this.defaultOptions.expected,
        } = params;

        return this.getDb(db)
        .addOperation(selectFunc, {table, select, where, connector, logQuery, expected});
    }
    /**@type {UpdateMethod}*/
    update(params={})
    {
        const
        {
            db=this.defaultOptions.db,
            table=this.defaultOptions.table,
            update=this.defaultOptions.update,
            where=this.defaultOptions.where,
            connector=this.defaultOptions.connector,
            logQuery=this.defaultOptions.logQuery
        } = params;

        return this.getDb(db)
        .addOperation(updateFunc, {table, update, where, connector, logQuery});
    }
    /**@type {DeleteMethod}*/
    delete(params={})
    {
        const
        {
            db=this.defaultOptions.db,
            table=this.defaultOptions.table,
            where=this.defaultOptions.where,
            connector=this.defaultOptions.connector,
            logQuery=this.defaultOptions.logQuery
        } = params;

        return this.getDb(db)
        .addOperation(deleteFunc, {table, where, connector, logQuery});
    }
    /**@type {ExistMethod}*/
    exist(params={})
    {
        const
        {
            db=this.defaultOptions.db,
            table=this.defaultOptions.table,
            where=this.defaultOptions.where,
            connector=this.defaultOptions.connector,
            logQuery=this.defaultOptions.logQuery
        } = params;

        return this.getDb(db)
        .addOperation(existFunc, {table, where, connector, logQuery});
    }
    /**@type {CountMethod}*/
    count(params={})
    {
        const
        {
            db=this.defaultOptions.db,
            table=this.defaultOptions.table,
            where=this.defaultOptions.where,
            connector=this.defaultOptions.connector,
            logQuery=this.defaultOptions.logQuery
        } = params;

        return this.getDb(db)
        .addOperation(countFunc, {table, where, connector, logQuery});
    }
    /**@type {ExecuteSQLMethod}*/
    executeSQL(params={})
    {
        const
        {
            db=this.defaultOptions.db,
            query=this.defaultOptions.query,
            logQuery=this.defaultOptions.logQuery,
            expected=this.defaultOptions.expected,
            type=this.defaultOptions.type,
        } = params;

        return this.getDb(db)
        .addOperation(executeSQLFunc, {query, logQuery, expected, type});
    }
};

module.exports = SqliteExpress;