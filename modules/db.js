const path = require('path');
const sqlite3 = require('sqlite3').verbose();

module.exports = route => {
    const absoluteRoute = path.resolve(process.cwd(), route);
    console.log(`The declared database is located at: ${absoluteRoute}`);
    return new sqlite3.Database(absoluteRoute);
}
