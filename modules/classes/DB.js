const Operation = require('./Operation');
class DB
{
    constructor({ db, key })
    {
        this._db = db;
        this._key = key;
        this._waitingList = [];
        this._isRunning = false;
        this.runWaitingList();
    }
    get db(){ return this._db }
    addOperation({ method, parameters, resolve, reject })
    {
        this._waitingList.push
        (
            new Operation
            ({
                method,
                parameters : { ...parameters, db : this.db },
                db : this,
                resolve,
                reject
            })
        );
        if(this._waitingList.length > 0 && !this._isRunning) this.runWaitingList()
    };
    runWaitingList()
    {
        this._isRunning = true;
        if(this._waitingList.length > 0)
        {
            let firstOpertion = this._waitingList.shift();
            firstOpertion.run();
        }
        else
        {
            this._isRunning = false;
            //this._db.close(); //REVISARRR
        }
    };
};

module.exports = DB;