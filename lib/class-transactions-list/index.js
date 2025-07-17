const Transaction = require("../class-transaction");

/**
 * @typedef {import("./types").TransactionsListType} TransactionsListType
 * @typedef {import("./types").TransactionsListClass} TransactionsListClass
 */

/**@type {TransactionsListClass}*/
const TransactionsList = class
{
    /**@param {ConstructorParameters<TransactionsListClass>[0]} context*/
    constructor(context)
    {
        /**@type {TransactionsListType["list"]}*/
        this.list = [];
        this.context = context;
        this.isRunning = false;
    }
    /**@type {TransactionsListType["createTransaction"]}*/
    createTransaction()
    {
        const transaction = new Transaction(this.context);
        this.list.push(transaction);
        if(!this.isRunning) this.run();
        return transaction;
    }
    /**@type {TransactionsListType["run"]}*/
    async run()
    {
        this.isRunning = true;
        while(this.list.length > 0)
        {
            const transaction = this.list.shift();
            if(!transaction) break;

            await transaction._startWaiter;
            transaction._operations.run();
            await transaction._endWaiter;
        }
        this.isRunning = false;
    }
}

module.exports = TransactionsList;