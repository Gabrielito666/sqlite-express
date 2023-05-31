const path = require('path')
const sqlite3 = require('sqlite3').verbose();
const directorio = path.resolve(__dirname);
module.exports = route =>{return new sqlite3.Database(directorio+"/.."+route);}