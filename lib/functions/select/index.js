const getWhereConstructor = require('../../tools/get-where-statement');
const consoleQuery = require('../../tools/console-query');
const wrapCall = require('../../tools/wrap-call');

/**
 * @typedef {import("./types").SelectFunction} SelectFunction
 * @typedef {import("./types").SelectSentenceFunction} SelectSentenceFunction
*/


/**@type {SelectSentenceFunction}*/
const selectSentence = ({table, select="*", where, logQuery=true}) =>
{
    const tableName = typeof table === 'string' ? table : table.tableName;

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

    const whereStatement = getWhereConstructor(where);

    const finalQuery = `SELECT ${selectStringRef.current} FROM ${tableName} ${whereStatement.query}`;
    const parameters = whereStatement.values;
    if (logQuery) consoleQuery(finalQuery, parameters);

    return { finalQuery, parameters };

}


/**@type {SelectFunction["rows"]}*/
const selectRows = (sqliteDb, {table, select, where, logQuery=true}) =>
{
    const {finalQuery, parameters} = selectSentence({table, select, where, logQuery});
    return new Promise((resolve, reject) =>
    {
        wrapCall.all(sqliteDb, finalQuery, parameters).then(rows =>
        {
            resolve(rows.length === 0 ? [] : rows);
        })
        .catch(reject);
    });
};

/**@type {SelectFunction["row"]}*/
const selectRow = (sqliteDb, {table, select, where, logQuery=true}) =>
{
    const {finalQuery, parameters} = selectSentence({table, select, where, logQuery});
    return new Promise((resolve, reject) =>
    {
        wrapCall.get(sqliteDb, finalQuery, parameters).then(row =>
        {
            resolve(row || null);
        })
        .catch(reject);
    });
};

/**@type {SelectFunction["celd"]}*/
const selectCeld = (sqliteDb, {table, select, where, logQuery=true}) =>
{
    const {finalQuery, parameters} = selectSentence({table, select, where, logQuery});
    return new Promise((resolve, reject) =>
    {
        wrapCall.get(sqliteDb, finalQuery, parameters).then(row =>
        {
            const celd = Object.values(row || {})[0] || null;
            resolve(celd);
        })
        .catch(reject);
    });
};

/**@type {SelectFunction["column"]}*/

const selectColumn = (sqliteDb, {table, select, where, logQuery=true}) =>
{
    const {finalQuery, parameters} = selectSentence({table, select, where, logQuery});
    return new Promise((resolve, reject) =>
    {
        wrapCall.all(sqliteDb, finalQuery, parameters).then(rows =>
        {
            resolve(rows.map(row => Object.values(row || {})[0] || null));
        })
        .catch(reject);
    });
};

/**@type {SelectFunction}*/
const select = Object.assign(selectRows, {
    rows: selectRows,
    row: selectRow,
    celd: selectCeld,
    column: selectColumn,
});

/**@type {SelectFunction}*/
module.exports = select;
