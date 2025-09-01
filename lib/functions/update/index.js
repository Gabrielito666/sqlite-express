const select = require('../select');
const whereConstructor = require('../../tools/get-where-statement');
const consoleQuery = require('../../tools/console-query');
const wrapCall = require('../../tools/wrap-call');

/**
 * @typedef {import("./types").UpdateFunction} UpdateFunction
 */
/**@type {UpdateFunction} */
const update = (sqliteDb, {table, update, where, logQuery=true}) =>
new Promise(async(resolve, reject) =>
{
    const tableName = typeof table === 'string' ? table : table.options.table;

    // Validar que update no esté vacío
    if (!update || Object.keys(update).length === 0) {
        reject(new Error('Update object cannot be empty'));
        return;
    }

    /**@type {Record<string, any>}*/
    const parameters = {};
    const columns = Object.keys(update);
    /**@type {string[]}*/
    const updateArray = [];
    const includesFunction = Object.values(update).some(value => typeof value === 'function');
    const positionRef = { current: 0 };
    
    /**@type {object[]|null} */
    //@ts-ignore
    const previousData = includesFunction ? await select.rows(sqliteDb, {
        table,
        select: `ROWID, ${columns.join(', ')}`,
        where,
        logQuery: false,
    }).
    catch(err =>
    {
        reject(err);
        return null;
    }) : null;

    if (includesFunction && previousData === null) {
        return; // Error already handled
    }

    // If we have functions but no data to update, reject
    if (includesFunction && (!previousData || previousData.length === 0)) {
        reject(new Error('No valid updates to perform'));
        return;
    }

    Object.entries(update).forEach(([column, value]) =>
    {
        if (typeof value === 'function')
        {
            const caseArray = previousData?.map(row =>
            {
                if (!row) return "";
                const keys = Object.keys(row);
                if (keys.length === 0) return "";
                const firstKey = keys[0];
                if (!firstKey) return "";
                //@ts-ignore
                const rowId = row[firstKey];
                //@ts-ignore
                const rowData = row[column];

                const result = value(rowData);
                positionRef.current++;
                parameters["@update" + positionRef.current.toString()] = result;
                return `WHEN ROWID = ${rowId} THEN @update${positionRef.current.toString()}`;
            }).filter(Boolean);

            if (caseArray && caseArray.length > 0) {
                const caseString = `CASE ${caseArray.join(' ')} ELSE ${column} END`;
                updateArray.push(`${column} = ${caseString}`);
            }
        }
        else if (typeof value === 'boolean')
        {
            positionRef.current++;
            parameters["@update" + positionRef.current.toString()] = value ? 1 : 0;
            updateArray.push(`${column} = @update${positionRef.current.toString()}`);
        }
        else if (typeof value === 'object')
        {
            positionRef.current++;
            parameters["@update" + positionRef.current.toString()] = JSON.stringify(value);
            updateArray.push(`${column} = @update${positionRef.current.toString()}`);
        }
        else
        {
            positionRef.current++;
            parameters["@update" + positionRef.current.toString()] = value;
            updateArray.push(`${column} = @update${positionRef.current.toString()}`);
        }
    });

    if (updateArray.length === 0) {
        reject(new Error('No valid updates to perform'));
        return;
    }

    const whereStatement = whereConstructor(where);

    const finalQuery = `UPDATE ${tableName} SET ${updateArray.join(', ')} ${whereStatement.query}`;
    Object.assign(parameters, whereStatement.values);
    
    if (logQuery) consoleQuery(finalQuery, parameters);
    
    wrapCall.run(sqliteDb, finalQuery, parameters).then((runResult) =>
    {
        if (logQuery) console.log(`Row updated successfully in table ${tableName}.`);
        resolve(runResult.changes);
    })
    .catch(reject);
});

module.exports = update;
