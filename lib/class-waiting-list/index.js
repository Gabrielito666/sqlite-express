/**
 * @typedef {import("./types").MethodType} MethodType
 * @typedef {import("./types").WaitingListType} WaitingListType
 * @typedef {import("./types").WaitingListClass} WaitingListClass
 * @typedef {import("./types").WaitingListConstructorMethod} WaitingListConstructorMethod
 * @typedef {import("./types").WaitingListAddOperationMethod<MethodType>} WaitingListAddOperationMethod
 * @typedef {import("./types").WaitingListRunMethod} WaitingListRunMethod
 */

/**@type {WaitingListClass}*/
const WaitingList = class
{
    /**@type {WaitingListConstructorMethod}*/
    constructor(database)
    {
        /**@type {function[]}*/
        this.list = [];
        this.isRunning = false;
        this.database = database;
    }
    /**@type {WaitingListAddOperationMethod}*/
    addOperation(method, parameters)
    {
        return new Promise((resolve, reject) =>
        {
            const runOperation = () =>
            {
                const operationPromise = new Promise((res, rej) =>
                {
                    method(parameters).then(res).catch(rej);
                });
                operationPromise.then(resolve).catch(reject);
                return operationPromise;
            }

            this.list.push(runOperation);
            
            if(this.list.length > 0 && !this.isRunning) this.run();
        });
    };
    /**@type {WaitingListRunMethod}*/
    async run()
    {
        this.isRunning = true;
        while(this.list.length > 0)
        {
            const operation = this.list.shift();
            if(!operation) break;

            await operation();
        }
        this.isRunning = false;
    };
}

module.exports = WaitingList;