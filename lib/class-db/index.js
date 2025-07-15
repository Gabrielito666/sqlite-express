/**
 * @typedef {import("./types").DBClass} DBClass
 * @typedef {import("./types").DBType} DBType
 * @typedef {import("./types").DBConstructorMethod} DBConstructorMethod
*/

const WaitingList = require("../class-waiting-list");
const path = require( 'path' );
const sqlite3 = require('sqlite3').verbose();

/**@type {DBClass}*/
const DB = class
{
    /**
     * @this {DBType}
     * @type {DBConstructorMethod}
    */
    constructor({context, route, logQuery})
    {

        route = path.isAbsolute(route)
        ?
        route
        :
        path.resolve(context._rootPath, route);
    
        if(logQuery) console.log(`The declared database is located at: ${route}`);

        this.sqliteDb = new sqlite3.Database(route);
        this.waitingList = new WaitingList(this);
        this.defaultOptions = context.defaultOptions.combination();
    }
};

module.exports = DB;