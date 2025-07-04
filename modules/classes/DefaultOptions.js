/**
 * @typedef {import("../types/index.d.ts").DefaultOptionsPrototype} DefaultOptionsPrototype
 * @typedef {import("../types/index.d.ts").DefaultOptionsConstructor} DefaultOptionsConstructor
 * @typedef {import("../types/index.d.ts").DefaultOptionsType} DefaultOptionsType
*/

/**
 * @class
 * @implements {DefaultOptionsPrototype}
*/
class DefaultOptionsClass
{
    /**
     * @param {string} route
     * @this {DefaultOptionsType}
    */
    constructor(route)
    {
        this._rootPath = route;
        this._emptyResult = undefined;
        this._route; 
        this._db;
        this._key;
        this._table;
        this._where;
        this._columns;
        this._select = '*';
        /**@type {"AND"|"OR"}*/
        this._connector = 'AND';
        this._update;
        this._row;
        this._processColumns = true;
        this._processRows = true;
        this._logQuery = true;
        this._query;
        this._join;
    };
    set rootPath(value) { this._rootPath = value };
    set emptyResult(value) { this._emptyResult = value; };
    set route(value) { this._route =  value; };
    set db(value)
    {
        this._db = value;
        this._key = value;
    };
    set key(value)
    {
        this._db = value;
        this._key = value;
    }
    set table(value) { this._table = value; };
    set where(value) { this._where = value; };
    set columns(value) { this._columns = value; };
    set select(value) { this._select = value; };
    /**@param {"AND"|"OR"} value*/
    set connector(value) { this._connector = value; };
    set update(value) { this._update = value; };
    set row(value) { this._row = value; };
    set processColumns(value) { this._processColumns = value; };
    set processRows(value) { this._processRows = value; };
    set logQuery(value) { this._logQuery = value; };
    set query(value) { this._query = value };
    set join(value) { this._join = value };
    
    get rootPath(){ return this._rootPath };
    get emptyResult() { return this._emptyResult; };
    get route() { return this._route; };
    get db() { return this._db; };
    get key(){ return this._key };
    get table() { return this._table; };
    get where() { return this._where; };
    get columns() { return this._columns; };
    get select() { return this._select; };
    /**@returns {object} */
    get connector() { return this._connector; };
    get update() { return this._update; };
    get row() { return this._row; };
    get processColumns() { return this._processColumns; };
    get processRows() { return this._processRows; };
    get logQuery() { return this._logQuery; };
    get query() { return this._query };
    get join() { return this._join };

    set(options = {})
    {
        [
            'emptyResult', 'route', 'db', 'table', 'where', 'columns',  'select', 'connector', 'update',
            'row', 'processColumns',  'processRows', 'logQuery', 'query', 'join'
        ]
        .forEach(property => { if (options.hasOwnProperty(property)) this[ property ] = options[ property ] });
    }
};

/**@type {DefaultOptionsConstructor}*/
const DefaultOptions = DefaultOptionsClass;

module.exports = DefaultOptions;