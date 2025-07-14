/**
 * @typedef {import("./types.d.ts").DefaultOptionsClass} DefaultOptionsClass
 * @typedef {import("./types.d.ts").DefaultOptionsConstructorMethod} DefaultOptionsConstructorMethod
 * @typedef {import("./types.d.ts").DefaultOptionsSetMethod} DefaultOptionsSetMethod
 * @typedef {import("./types.d.ts").DefaultOptionsType} DefaultOptionsType
 * @typedef {import("./types.d.ts").DefaultOptionsSetParams} DefaultOptionsSetParams
 * @typedef {import("../types/index").Where} Where
 * @typedef {import("../types/index").ColumnType} ColumnType
 * @typedef {import("../types/index").UpdateParams} UpdateParams
*/

/**@type {("route"|"db"|"key"|"table"|"where"|"columns"|"select"|"connector"|"update"|"row"|"logQuery"|"query"|"expected"|"parameters"|"type")[]}*/
const paramsKeys = [
    'route',
    'db',
    'key',
    'table',
    'where',
    'columns',
    'select',
    'connector',
    'update',
    'row',
    'logQuery',
    'query',
    'expected',
    'parameters',
    'type'
]

/**
 * @type {DefaultOptionsClass}
 */
const DefaultOptions = class
{
    /**
     * @type {DefaultOptionsConstructorMethod}
     * @this {DefaultOptionsType}
    */
    constructor(route)
    {
        this._rootPath = route;
        this._route; 
        this._db;
        this._key;
        this._table;
        this._where;
        this._columns;
        /**@type {string|string[]}*/
        this._select = '*';
        /**@type {"AND"|"OR"}*/
        this._connector = 'AND';
        this._update;
        this._row;
        this._logQuery = false;
        this._query;
        this._expected = 'rows';
        this._parameters = {};
        this._type = 'any';
    }
    
    /**@param {string} value*/
    set rootPath(value) 
    {
        this._rootPath = value; 
    }
    
    /**@param {string} value*/
    set route(value) 
    { 
        this._route = value; 
    }
    
    /**@param {string} value*/
    set db(value)
    {
        this._db = value;
        this._key = value;
    }
    
    /**@param {string} value*/
    set key(value)
    {
        this._db = value;
        this._key = value;
    }
    
    /**@param {string} value*/
    set table(value) 
    { 
        this._table = value; 
    }
    
    /**@param {Where} value*/
    set where(value) 
    { 
        this._where = value; 
    }
    
    /**@param {ColumnType} value*/
    set columns(value) 
    { 
        this._columns = value; 
    }
    
    /**@param {string|string[]} value*/
    set select(value) 
    { 
        this._select = value; 
    }
    
    /**@param {"AND"|"OR"} value*/
    set connector(value) 
    { 
        this._connector = value; 
    }
    
    /**@param {UpdateParams} value*/
    set update(value) 
    { 
        this._update = value; 
    }
    
    /**@param {{[key:string]:string|number|boolean|Object|null}} value*/
    set row(value) 
    { 
        this._row = value; 
    }
    
    /**@param {boolean} value*/
    set logQuery(value) 
    { 
        this._logQuery = value; 
    }
    
    /**@param {string} value*/
    set query(value) 
    { 
        this._query = value; 
    }
    
    /**@param {string} value*/
    set expected(value) 
    { 
        this._expected = value; 
    }
    
    /**@param {{[key: string]: any}} value*/
    set parameters(value) 
    { 
        this._parameters = value; 
    }
    
    /**@param {string} value*/
    set type(value) 
    { 
        this._type = value; 
    }
    

    
    /**@returns {string}*/
    get rootPath()
    { 
        return this._rootPath; 
    }
    
    /**@returns {string|undefined}*/
    get route() 
    { 
        return this._route; 
    }
    
    /**@returns {string|undefined}*/
    get db() 
    { 
        return this._db; 
    }
    
    /**@returns {string|undefined}*/
    get key()
    { 
        return this._key; 
    }
    
    /**@returns {string|undefined}*/
    get table() 
    { 
        return this._table; 
    }
    
    /**@returns {Where|undefined}*/
    get where() 
    { 
        return this._where; 
    }
    
    /**@returns {ColumnType|undefined}*/
    get columns() 
    { 
        return this._columns; 
    }
    
    /**@returns {string|string[]|undefined}*/
    get select() 
    { 
        return this._select; 
    }
    
    /**@returns {"AND"|"OR"|undefined}*/
    get connector() 
    { 
        return this._connector; 
    }
    
    /**@returns {UpdateParams|undefined}*/
    get update() 
    { 
        return this._update; 
    }
    
    /**@returns {{[key:string]:string|number|boolean|Object|null}|undefined}*/
    get row() 
    { 
        return this._row; 
    }
    
    /**@returns {boolean}*/
    get logQuery() 
    { 
        return this._logQuery; 
    }
    
    /**@returns {string|undefined}*/
    get query() 
    { 
        return this._query; 
    }
    
    /**@returns {string}*/
    get expected() 
    { 
        return this._expected; 
    }
    
    /**@returns {{[key: string]: any}}*/
    get parameters() 
    { 
        return this._parameters; 
    }
    
    /**@returns {string}*/
    get type() 
    { 
        return this._type; 
    }
    


    /**
     * @type {DefaultOptionsSetMethod}
     */
    set(options = {})
    {
        
        paramsKeys.forEach(property => 
        { 
            if (options.hasOwnProperty(property)) 
            { 
                //@ts-ignore
                this[property] = options[property]; 
            } 
        });
    }
};

module.exports = DefaultOptions;