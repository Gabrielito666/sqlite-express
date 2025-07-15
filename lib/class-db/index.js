const createTable = require("../function-create-table");
const select = require("../function-select");
const insert = require("../function-insert");
const update = require("../function-update");
const deleteFunction = require("../function-delete");
const exist = require("../function-exist");
const count = require("../function-count");
const executeSQL = require("../function-execute-sql");
const Options = require("../class-options");
const {parametersEvalCreateDb} = require("../tool-parameters-eval/index");

/**
 * @typedef {import("./types").DBClass} DBClass
 * @typedef {import("./types").DBType} DBType
 * @typedef {import("../class-options/types").ExpectedParam} ExpectedParam
 * @typedef {import("../class-options/types").TypeParam} TypeParam
 * @typedef {import("./types").DBConstructorMethod} DBConstructorMethod
 * @typedef {import("./types").DBCreateTableMethod} DBCreateTableMethod
 * @typedef {import("./types").DBSelectMethod<ExpectedParam>} DBSelectMethod
 * @typedef {import("./types").DBInsertMethod} DBInsertMethod
 * @typedef {import("./types").DBUpdateMethod} DBUpdateMethod
 * @typedef {import("./types").DBDeleteMethod} DBDeleteMethod
 * @typedef {import("./types").DBExistMethod} DBExistMethod
 * @typedef {import("./types").DBCountMethod} DBCountMethod
 * @typedef {import("./types").DBExecuteSQLMethod<ExpectedParam, TypeParam>} DBExecuteSQLMethod
*/

const WaitingList = require("../class-waiting-list");
const path = require( 'path' );
const sqlite3 = require('sqlite3').verbose();

/**@type {DBClass}*/
const DB = class
{
    /**
     * @this {DBType}
     * @type {DBConstructorMethod}
    */
    constructor(context, options)
    {
        const { route, logQuery } = parametersEvalCreateDb(options);

        const routePath = path.isAbsolute(route)
        ?
        route
        :
        path.resolve(context._rootPath, route);
    
        if(logQuery) console.log(`The declared database is located at: ${route}`);

        this.sqliteDb = new sqlite3.Database(routePath);
        this.waitingList = new WaitingList(this);
        const baseOptions = new Options(context, context._rootPath);
        this.defaultOptions = baseOptions.combination(options, context.defaultOptions);

        this.defaultOptions.set({
            db: this,
            route: route
        });
    }
    /**
     * @type {DBCreateTableMethod}
     * @this {DBType}
    */
    createTable(params)
    {
        const options = this.defaultOptions.combination(params);
        options.db = this;

        return this.waitingList.addOperation(createTable, options);
    }

    /**
     * @type {DBSelectMethod}
     * @this {DBType}
    */
    select(params)
    {
        const options = this.defaultOptions.combination(params);
        options.db = this;

        return this.waitingList.addOperation(select, options);
    }

    /**
     * @type {DBInsertMethod}
     * @this {DBType}
    */
    insert(params)
    {
        const options = this.defaultOptions.combination(params);
        options.db = this;

        return this.waitingList.addOperation(insert, options);
    }

    /**
     * @type {DBUpdateMethod}
     * @this {DBType}
    */
    update(params)
    {
        const options = this.defaultOptions.combination(params);
        options.db = this;

        return this.waitingList.addOperation(update, options);
    }

    /**
     * @type {DBDeleteMethod}
     * @this {DBType}
    */
    delete(params)
    {
        const options = this.defaultOptions.combination(params);
        options.db = this;

        return this.waitingList.addOperation(deleteFunction, options);
    }

    /**
     * @type {DBExistMethod}
     * @this {DBType}
    */
    exist(params)
    {
        const options = this.defaultOptions.combination(params);
        options.db = this;

        return this.waitingList.addOperation(exist, options);
    }

    /**
     * @type {DBCountMethod}
     * @this {DBType}
    */
    count(params)
    {
        const options = this.defaultOptions.combination(params);
        options.db = this;

        return this.waitingList.addOperation(count, options);
    }

    /**
     * @type {DBExecuteSQLMethod}
     * @this {DBType}
    */
    executeSQL(params)
    {
        const options = this.defaultOptions.combination(params);
        options.db = this;

        return this.waitingList.addOperation(executeSQL, options);
    }
};


module.exports = DB;