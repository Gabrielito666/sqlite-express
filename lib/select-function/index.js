const getWhereConstructor = require('../get-where-statement');
const consoleQuery = require('../console-query');
const expectedSwitch = require('../expected-switch');

/**
 * @typedef {import("./types").SelectFunction} SelectFunction
*/
/**@type {SelectFunction}*/
const select = ({ db, table, select, where, connector, expected = /**@type {"rows"}*/ ("rows"), logQuery = false }) =>
new Promise((resolve, reject) =>
{
    if (Array.isArray(select))
    {
        select = select.join(', ');
    }
    else if (typeof select === "object")
    {
        select = Object
            .entries(select).map(([key, value]) => `${key} AS ${value.as}`)
            .join(', ');
    }

    const whereStatement = getWhereConstructor(where, connector);

    const finalQuery = `SELECT ${select} FROM ${table} ${whereStatement.query}`;
    const parameters = whereStatement.values;
    if (logQuery) consoleQuery(finalQuery, parameters);

    expectedSwitch({
        db,
        query: finalQuery,
        parameters,
        expected,
        logQuery
    })
    //@ts-ignore
    .then(resolve).catch(reject);
});

module.exports = select;