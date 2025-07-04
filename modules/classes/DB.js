/**
 * @typedef {import("../types/db.d.ts").DBConstructor} DBConstructor
 * @typedef {import("../types/db.d.ts").DBPrototype} DBPrototype
 * @typedef {import("../types/db.d.ts").DBType} DBType
 * @typedef {import("../types/db.d.ts").dbConstructorFunc} dbConstructorFunc
 * @typedef {import("../types/db.d.ts").dbAddOperationMethod} dbAddOperationMethod
*/

/**
 * @class
 * @implements {DBPrototype}
*/
class DBClass
{
    /**
     * @this {DBType}
     * @type {dbConstructorFunc}
    */
    constructor(sqliteDb, key)
    {
        this.sqliteDb = sqliteDb;
        this.key = key;
        this.waitingList = [];
        this.isRunning = false;
        this.runWaitingList();
    }

    /**@type {dbAddOperationMethod}*/
    addOperation(method, parameters)
    {
        return new Promise((resolve, reject) =>
        {
            const runOperation = () =>
            {
                const operationPromise = new Promise((res, rej) => {
                    method({db: this.sqliteDb, ...parameters}).then(res).catch(rej);
                });
                operationPromise.then(resolve).catch(reject);
                return operationPromise;
            }

            this.waitingList.push(runOperation);
            
            if(this.waitingList.length > 0 && !this.isRunning) this.runWaitingList();
        });
    };
    async runWaitingList()
    {
        this.isRunning = true;
        while(this.waitingList.length > 0)
        {
            const operation = this.waitingList.shift();
            await operation();
        }
        this.isRunning = false;
        //this.sqliteDb.close(); //REVISARRR
    };
};

/**@type {DBConstructor}*/
const DB = DBClass;

module.exports = DB;