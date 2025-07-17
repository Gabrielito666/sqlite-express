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
            const operation = () =>
            {
                return method(parameters).then(resolve).catch(reject);
            }

            this.list.push(operation);
            
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