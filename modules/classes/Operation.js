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
        }
        catch(error)
        {
            this._reject(error)
        }
        finally
        {
            this._db.runWaitingList();
        }
    }
};
module.exports = Operation;