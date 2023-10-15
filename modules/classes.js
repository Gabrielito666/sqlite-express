const path = require( 'path' );
const methods = require( './methods' );

class DB{
    constructor( { db, key } ){
        this._db = db;
        this._key = key;
        this._waitingList = [];
        this._isRunning = false;
        this.runWaitingList();
    }
    get db(){ return this._db }
    addOperation( { method, parameters, resolve, reject } ){
        this._waitingList.push( new Operation( {
            method : method,
            parameters : parameters,
            db : this,
            resolve : resolve,
            reject : reject
        } ) );
        if( this._waitingList.length > 0 && !this._isRunning ) this.runWaitingList()
    };
    runWaitingList(){
        this._isRunning = true;
        if( this._waitingList.length > 0 ){
            let firstOpertion = this._waitingList.shift();
            firstOpertion.run();
        }else{
            this._isRunning = false;
            //this._db.close(); //REVISARRR
        }
    };
}
class Operation{
    constructor( { method, parameters, db, resolve, reject } ){
        this._method = method;
        this._parameters = parameters;
        this._db = db;
        this._resolve = resolve;
        this._reject = reject;
    }
    async run(){
        try{
            const result = await methods[ this._method ]( this._parameters );
            this._resolve( result );
            this._db.runWaitingList();
        }catch(error){
            this._reject( error )
        };
    }
};
class DefaultOptions{
    constructor( route ){
        this._rootPath = route;
        this._emptyResult = undefined;
        this._route; 
        this._db;
        this._key;
        this._table;
        this._where;
        this._columns;
        this._select = '*';
        this._connector = 'AND';
        this._update;
        this._row;
        this._processColumns = true;
        this._processRows = true;
        this._logQuery = true;
    };
    set emptyResult( value ) { this._emptyResult = value; };
    set route( value ) { this._route =  value; };
    set db( value ) {
        this._db = value;
        this._key = value;
    };
    set key( value ){
        this._db = value;
        this._key = value;
    }
    set table( value ) { this._table = value; };
    set where( value ) { this._where = value; };
    set columns( value ) { this._columns = value; };
    set select( value ) { this._select = value; };
    set connector( value ) { this._connector = value; };
    set update( value ) { this._update = value; };
    set row( value ) { this._row = value; };
    set processColumns( value ) { this._processColumns = value; };
    set processRows( value ) { this._processRows = value; };
    set logQuery( value ) { this._logQuery = value; };
    
    get emptyResult() { return this._emptyResult; };
    get route() { return this._route; };
    get db() { return this._db; };
    get key(){ return this._key };
    get table() { return this._table; };
    get where() { return this._where; };
    get columns() { return this._columns; };
    get select() { return this._select; };
    get connector() { return this._connector; };
    get update() { return this._update; };
    get row() { return this._row; };
    get processColumns() { return this._processColumns; };
    get processRows() { return this._processRows; };
    get logQuery() { return this._logQuery; };

    set( options = {} ) {
        const allowedProperties = [
            'emptyResult',
            'route',
            'db',
            'table',
            'where',
            'columns', 
            'select',
            'connector',
            'update',
            'row',
            'processColumns', 
            'processRows',
            'logQuery'
        ];

        for ( let property of allowedProperties ) {
            if ( options.hasOwnProperty( property ) ) this[ property ] = options[ property ];
        }
    }

};

module.exports = { DB : DB, Operation : Operation, DefaultOptions : DefaultOptions };