const Options = require("../class-options");
const OperationsList = require("../class-operations-list");
const Events = require("events");

const createTable = require("../function-create-table");
const select = require("../function-select");
const insert = require("../function-insert");
const update = require("../function-update");
const deleteFunction = require("../function-delete");
const exist = require("../function-exist");
const count = require("../function-count");
const executeSQL = require("../function-execute-sql");
const beginTransaction = require("../function-begin-transaction");
const rollback = require("../function-rollback");
const commit = require("../function-commit");
const declareSQL = require("../function-declare-sql");

/**
 * @typedef {import("./types").TransactionType} TransactionType
 * @typedef {import("./types").TransactionClass} TransactionClass
 * @typedef {import("../function-begin-transaction/types").BeginTransactionFunction} BeginTransactionFunction
 * @typedef {import("../function-rollback/types").RollbackFunction} RollbackFunction
 * @typedef {import("../function-commit/types").CommitFunction} CommitFunction
 */

/**@type {TransactionClass}*/
const Transaction = class
{
    /**@param {ConstructorParameters<TransactionClass>[0]} context*/
    constructor(context)
    {
        this._context = context;
        this._operations = new OperationsList();
        this._eventEmitter = new Events.EventEmitter();

        this._endWaiter = new Promise((resolve) =>
        {
            this._eventEmitter.once("end", resolve);
        });
        this._startWaiter = new Promise((resolve) =>
        {
            this._eventEmitter.once("start", resolve);
        });

    }

    /**@type {TransactionType["end"]}*/
    end()
    {
        this._operations.end();
        this._eventEmitter.emit("end");
    }

    /**@type {TransactionType["start"]}*/
    start()
    {
        this._eventEmitter.emit("start");
    }

    /**@type {TransactionType["createTable"]}*/
    createTable(args)
    {
        const ops = new Options([args, this._context.defaultOptions]);
        return this._operations.addOperation(createTable, ops);
    }

    /**@type {TransactionType["select"]}*/
    select(args)
    {
        const ops = new Options([args, this._context.defaultOptions]);
        return this._operations.addOperation(select, ops);
    }

    /**@type {TransactionType["insert"]}*/
    insert(args)
    {
        const ops = new Options([args, this._context.defaultOptions]);
        return this._operations.addOperation(insert, ops);
    }

    /**@type {TransactionType["update"]}*/
    update(args)
    {
        const ops = new Options([args, this._context.defaultOptions]);
        return this._operations.addOperation(update, ops);
    }

    /**@type {TransactionType["delete"]}*/
    delete(args)
    {
        const ops = new Options([args, this._context.defaultOptions]);
        return this._operations.addOperation(deleteFunction, ops);
    }

    /**@type {TransactionType["exist"]}*/
    exist(args)
    {
        const ops = new Options([args, this._context.defaultOptions]);
        return this._operations.addOperation(exist, ops);
    }

    /**@type {TransactionType["count"]}*/
    count(args)
    {
        const ops = new Options([args, this._context.defaultOptions]);
        return this._operations.addOperation(count, ops);
    }

    /**@type {TransactionType["executeSQL"]}*/
    executeSQL(args)
    {
        const ops = new Options([args, this._context.defaultOptions]);
        return this._operations.addOperation(executeSQL, ops);
    }

    /**@type {TransactionType["beginTransaction"]}*/
    beginTransaction(args)
    {
        const ops = new Options([args, this._context.defaultOptions]);
        return this._operations.addOperation(beginTransaction, ops);
    }

    /**@type {TransactionType["rollback"]}*/
    rollback(args)
    {
        const ops = new Options([args, this._context.defaultOptions]);
        return this._operations.addOperation(rollback, ops);
    }

    /**@type {TransactionType["commit"]}*/
    commit(args)
    {
        const ops = new Options([args, this._context.defaultOptions]);
        return this._operations.addOperation(commit, ops);
    }

    /**@type {TransactionType["declareSQL"]}*/
    declareSQL(args)
    {
        const ops = new Options([args, this._context.defaultOptions]);
        return this._operations.addOperation(declareSQL, ops);
    }
}

module.exports = Transaction;