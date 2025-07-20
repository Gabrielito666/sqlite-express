const fs = require("fs");

/**
 * @typedef {import("./types").PathOrSqlFunction} PathOrSqlFunction
*/
/**@type {PathOrSqlFunction}*/
const pathOrSql = (input) =>
{
    if(fs.existsSync(input)) return fs.readFileSync(input, "utf8");
    else return input;
}
module.exports = pathOrSql;