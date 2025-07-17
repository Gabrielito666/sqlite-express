/**
 * @typedef {import("./types").OperationsListType} OperationsListType
 * @typedef {import("./types").OperationsListClass} OperationsListClass
 */

/**@type {OperationsListClass}*/
const OperationsList = class
{
    constructor()
    {
        /**@type {OperationsListType["list"]}*/
        this.list = [];
        this.isRunning = false;
        this.isEnded = false;
    }

    /**@type {OperationsListType["addOperation"]}*/
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
    /**@type {OperationsListType["run"]}*/
    async run()
    {
        this.isRunning = true;
        while(this.list.length > 0 && !this.isEnded)
        {
            const operation = this.list.shift();
            if(!operation) break;

            await operation();
        }
        this.isRunning = false;
    };

    end()
    {
        this.isEnded = true;
    }
}

module.exports = OperationsList;