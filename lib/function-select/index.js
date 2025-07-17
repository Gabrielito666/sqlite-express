const getWhereConstructor = require('../tool-get-where-statement');
const consoleQuery = require('../tool-console-query');
const expectedSwitch = require('../tool-expected-switch');
const {parametersEvalSelect} = require('../tool-parameters-eval');
/**
 * @typedef {import("./types").SelectFunction} SelectFunction
*/
/**@type {SelectFunction}*/
const select = (options) =>
new Promise((resolve, reject) =>
{
    const {db, table, select, where, connector, logQuery, expected} = parametersEvalSelect(options);

    const selectStringRef = { current: select };

    if (Array.isArray(select))
    {
        selectStringRef.current = select.join(', ');
    }
    else if (typeof select === "object")
    {
        selectStringRef.current = Object
            .entries(select).map(([key, value]) => `${key} AS ${value.as}`)
            .join(', ');
    }

    const whereStatement = getWhereConstructor(where, connector);

    const finalQuery = `SELECT ${selectStringRef.current} FROM ${table} ${whereStatement.query}`;
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