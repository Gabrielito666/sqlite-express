const path = require( 'path' );
const onOperation = require( './modules/onOperation' );
const newDB = require('./modules/db');
const processParams = require( './modules/processParams' );
const { DefaultOptions } = require( './modules/classes' );

class SqliteExpress{
    constructor(root){
        this._dataBasesList = {};
        this._rootPath =  root ? root : (module.parent.filename ? path.dirname(module.parent.filename) : '.');
        this._defaultOptions = new DefaultOptions( this._rootPath );
    }
    set rootPath( value ){
        [ this._rootPath, this._defaultOptions._rootPath, this._defaultOptions.root ] = Array(3).fill(value);
    }
    get rootPath(){ return this._rootPath };
    get dataBasesList(){ return Object.keys( this._dataBasesList ) };
    get defaultOptions(){ return this._defaultOptions };
    createDB( ...params ) { return newDB( {
        ...processParams( 'createDB', params, this._defaultOptions ),
        context : this,
    } ) };
    createTable( ...params ){ return onOperation( {
        method : 'createTable',
        parameters : params,
        context : this
    } ) };
    insert( ...params ){ return onOperation( {
        method : 'insert',
        parameters : params,
        context : this
    } ) };
    select( ...params ){ return onOperation( {
        method : 'select',
        parameters : params,
        context : this
    } ) };
    update( ...params ){ return onOperation( {
        method : 'update',
        parameters : params,
        context : this
    } ) };
    delete( ...params ){ return onOperation( {
        method : 'delete',
        parameters : params,
        context : this
    } ) };
    exist( ...params ){ return onOperation( {
        method : 'exist',
        parameters : params,
        context : this
    } ) };
    count( ...params ){ return onOperation( {
        method : 'count',
        parameters : params,
        context : this
    } ) };
}

module.exports = SqliteExpress;
/*
    Cambiamos name en createTable por table
    y columns en select por select
    y conector por connector
*/