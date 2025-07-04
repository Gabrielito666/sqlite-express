const newDB = require('./modules/methods/db');
const DefaultOptions = require('./modules/classes/DefaultOptions');

const createTableFunc = require('./modules/methods/table');
const insertFunc = require("./modules/methods/insert");
const selectFunc = require("./modules/methods/select");
const updateFunc = require("./modules/methods/update");
const deleteFunc = require("./modules/methods/delete");
const existFunc = require("./modules/methods/exist");
const countFunc = require("./modules/methods/count");
const executeSQLFunc = require("./modules/methods/executeSQL");

/**
 * @typedef {import("./modules/types/sqlite-express.d.ts").GetDbMethod} GetDbMethod
 * @typedef {import("./modules/types/sqlite-express.d.ts").CountMethod} CountMethod
 * @typedef {import("./modules/types/sqlite-express.d.ts").CreateDbMethod} CreateDbMethod
 * @typedef {import("./modules/types/sqlite-express.d.ts").CreateTableMethod} CreateTableMethod
 * @typedef {import("./modules/types/sqlite-express.d.ts").DeleteMethod} DeleteMethod
 * @typedef {import("./modules/types/sqlite-express.d.ts").ExecuteSQLMethod} ExecuteSQLMethod
 * @typedef {import("./modules/types/sqlite-express.d.ts").ExistMethod} ExistMethod
 * @typedef {import("./modules/types/sqlite-express.d.ts").InsertMethod} InsertMethod
 * @typedef {import("./modules/types/sqlite-express.d.ts").SelectMethod} SelectMethod
 * @typedef {import("./modules/types/sqlite-express.d.ts").SqliteExpressConstructorFunction} SqliteExpressConstructorFunction
 * @typedef {import("./modules/types/sqlite-express.d.ts").UpdateMethod} UpdateMethod
 * @typedef {import("./modules/types/sqlite-express.d.ts").SqliteExpressConstructor} SqliteExpressConstructor
 * @typedef {import("./modules/types/sqlite-express.d.ts").SqliteExpressPrototype} SqliteExpressPrototype
 * @typedef {import("./modules/types/sqlite-express.d.ts").SqliteExpressType} SqliteExpressType
*/

/**
 * @class
 * @implements {SqliteExpressType}
 */
class SqliteExpressClass
{
    /**
     * @this {SqliteExpressType}
     * @type {SqliteExpressConstructorFunction}
     */
    constructor(rootPath=process.cwd())
    {
        this._dataBasesList = {};
        this._rootPath =  rootPath;
        this._defaultOptions = new DefaultOptions(this._rootPath);
    }

    set rootPath(value)
    {
        [ this._rootPath, this._defaultOptions.rootPath ] = Array(2).fill(value);
    }
    get rootPath(){ return this._rootPath };
    get defaultOptions(){ return this._defaultOptions };

    /**
     * This function creates a sqlite database
     * @type {CreateDbMethod}
    */
    createDB(params={})
    {
        const
        {
            route=this.defaultOptions.route,
            key=this.defaultOptions.key,
            logQuery=this.defaultOptions.logQuery
        } = params;

        return newDB({ context : this, route, key, logQuery });
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
            join=this.defaultOptions.join,
            processColumns=this.defaultOptions.processColumns,
            processRows=this.defaultOptions.processRows,
            emptyResult=this.defaultOptions.emptyResult,
            logQuery=this.defaultOptions.logQuery
        } = params;

        return this.getDb(db).addOperation(selectFunc, {table, select, where, connector, join, processColumns, processRows, emptyResult, logQuery});
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

        return this.getDb(db).addOperation(updateFunc, {table, update, where, connector, logQuery});
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

        return this.getDb(db).addOperation(deleteFunc, {table, where, connector, logQuery});
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

        return this.getDb(db).addOperation(existFunc, {table, where, connector, logQuery});
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

        return this.getDb(db).addOperation(countFunc, {table, where, connector, logQuery});
    }
    executeSQL(params={})
    {
        const
        {
            db=this.defaultOptions.db,
            query=this.defaultOptions.query,
            logQuery=this.defaultOptions.logQuery,
            emptyResult=this.defaultOptions.emptyResult,
            processColumns=this.defaultOptions.processColumns,
            processRows=this.defaultOptions.processRows
        } = params;

        return this.getDb(db).addOperation(executeSQLFunc, {query, logQuery, emptyResult, processColumns, processRows});
    }
};

/**@type {SqliteExpressConstructor}*/
const SqliteExpress = SqliteExpressClass;
module.exports = SqliteExpress;