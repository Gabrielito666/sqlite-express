class Operation
{
    constructor({ method, parameters, db, resolve, reject })
    {
        this._method = method;
        this._parameters = parameters;
        this._db = db;
        this._resolve = resolve;
        this._reject = reject;
    };
    async run()
    {
        try
        {
            const result = await this._method(this._parameters);
            this._resolve(result);
            this._db.runWaitingList();
        }
        catch(error)
        {
            this._reject(error)
        };
    }
};
module.exports = Operation;