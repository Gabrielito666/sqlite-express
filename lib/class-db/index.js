const Options = require("../class-options");
const {parametersEvalCreateDb} = require("../tool-parameters-eval/index");

/**
 * @typedef {import("./types").DBClass} DBClass
 * @typedef {import("./types").DBType} DBType
*/

const TransactionsList = require("../class-transactions-list");
const path = require( 'path' );
const sqlite3 = require('sqlite3').verbose();

/**@type {DBClass}*/
const DB = class
{
    /**
     * @this {DBType}
     * @param {ConstructorParameters<DBClass>[0]} context
     * @param {ConstructorParameters<DBClass>[1]} options
    */
    constructor(context, options)
    {
        const { route, logQuery } = parametersEvalCreateDb(options);

        const routePath = path.resolve(context._rootPath, route);
    
        if(logQuery) console.log(`The declared database is located at: ${route}`);

        this.sqliteDb = new sqlite3.Database(routePath);
        this.transactionsList = new TransactionsList(this);
        this.defaultOptions = new Options([context.defaultOptions]);

        this.defaultOptions.set({
            db: this,
            route: route
        });

        //Fix Parameters
        Object.defineProperty(this, 'sqliteDb', {
            value: this.sqliteDb,
            writable: false,
        });
        Object.defineProperty(this, 'transactionsList', {
            value: this.transactionsList,
            writable: false,
        });
        Object.defineProperty(this, 'defaultOptions', {
            value: this.defaultOptions,
            writable: false,
        });

        //Fix Options
        this.defaultOptions.fix('db');
        this.defaultOptions.fix('route');
    }

    createTransaction()
    {
        return this.transactionsList.createTransaction();
    }

    /**
     * @type {DBType["createTable"]}
     * @this {DBType}
    */
    createTable(args)
    {
        const options = new Options([args, this.defaultOptions]);
        const transaction = this.createTransaction();

        transaction.start();
        return transaction.createTable(options)
        .then(result =>
        {
            transaction.end();
            return result;
        });
    }

    /**
     * @type {DBType["select"]}
     * @this {DBType}
    */
    select(args)
    {
        const options = new Options([args, this.defaultOptions]);
        const transaction = this.createTransaction();

        transaction.start();
        return transaction.select(options)
        .then(result =>
        {
            transaction.end();
            return result;
        });
    }

    /**
     * @type {DBType["insert"]}
     * @this {DBType}
    */
    insert(args)
    {
        const options = new Options([args, this.defaultOptions]);
        options.db = this;
        const transaction = this.createTransaction();

        transaction.start();
        return transaction.insert(options)
        .then(result =>
        {
            transaction.end();
            return result;
        });
    }

    /**
     * @type {DBType["update"]}
     * @this {DBType}
    */
    update(args)
    {
        const options = new Options([args, this.defaultOptions]);
        const transaction = this.createTransaction();

        transaction.start();
        return transaction.update(options)
        .then(result =>
        {
            transaction.end();
            return result;
        });
    }

    /**
     * @type {DBType["delete"]}
     * @this {DBType}
    */
    delete(args)
    {
        const options = new Options([args, this.defaultOptions]);
        const transaction = this.createTransaction();

        transaction.start();
        return transaction.delete(options)
        .then(result =>
        {
            transaction.end();
            return result;
        });
    }

    /**
     * @type {DBType["exist"]}
     * @this {DBType}
    */
    exist(args)
    {
        const options = new Options([args, this.defaultOptions]);
        const transaction = this.createTransaction();

        transaction.start();
        return transaction.exist(options)
        .then(result =>
        {
            transaction.end();
            return result;
        });
    }

    /**
     * @type {DBType["count"]}
     * @this {DBType}
    */
    count(args)
    {
        const options = new Options([args, this.defaultOptions]);
        const transaction = this.createTransaction();

        transaction.start();
        return transaction.count(options)
        .then(result =>
        {
            transaction.end();
            return result;
        });
    }

    /**
     * @type {DBType["executeSQL"]}
     * @this {DBType}
    */
    executeSQL(args)
    {
        const options = new Options([args, this.defaultOptions]);
        const transaction = this.createTransaction();

        transaction.start();
        //@ts-ignore
        return transaction.executeSQL(options)
        .then(result =>
        {
            transaction.end();
            return result;
        });
    }

    /**@type {DBType["beginTransaction"]}*/
    beginTransaction(args)
    {
        const options = new Options([args, this.defaultOptions]);
        const transaction = this.createTransaction();
        return transaction.beginTransaction(options);
    }

    /**@type {DBType["rollback"]}*/
    rollback(args)
    {
        const options = new Options([args, this.defaultOptions]);
        const transaction = this.createTransaction();
        return transaction.rollback(options);
    }

    /**@type {DBType["commit"]}*/
    commit(args)
    {
        const options = new Options([args, this.defaultOptions]);
        const transaction = this.createTransaction();
        return transaction.commit(options);
    }
};


module.exports = DB;