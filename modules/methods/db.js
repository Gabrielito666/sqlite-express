const path = require( 'path' );
const sqlite3 = require('sqlite3').verbose();
const DB = require('./../classes/DB');
const { randomBytes } = require('crypto');

//the default value for key is a hexagecimal string in case of not explcit a key
module.exports = ({ route, key = randomBytes(32).toString('hex'), logQuery, context }) => {

    route = path.isAbsolute(route) ? route : path.resolve(context._rootPath, route);
    
    if(logQuery) console.log(`The declared database is located at: ${route}`);
    context._dataBasesList[key] = new DB(new sqlite3.Database(route), key);
    //if this is the first database to create. this are default database
    if(Object.keys(context._dataBasesList).length === 1 && !context._defaultOptions.db) context._defaultOptions.db = key;
    return key;
}