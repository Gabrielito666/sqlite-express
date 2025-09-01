const consoleQuery = require('../../tools/console-query');
const wrapCall = require('../../tools/wrap-call');

/**
 * @typedef {import("./types").InsertFunction} InsertFunction;
*/
/**@type {InsertFunction}*/
const insert = (sqliteDb, {table, row, logQuery=true}) =>
new Promise((resolve, reject) =>
{
    const tableName = typeof table === 'string' ? table : table.tableName;

	const rows = Array.isArray(row) ? row : [row];
	    
	const columns = Object.keys(rows[0]);

	/**@type {Record<string, any>}*/
	const parameters = {};

	const rowsStrings = rows.map((row, i) =>
	{ 
	    columns.forEach(col =>
	    {
		parameters[`@${col}_${i}`] = row[col];
	    });

	    return "(" + columns.map(col => `@${col}_${i}`).join(', ') + ")";

	});

	const columnsString = columns.join(", ");
	const valuesString = rowsStrings.join(", ");

    	const finalQuery = `INSERT INTO ${tableName}(${columnsString}) VALUES${valuesString}`;

    	if (logQuery)
    	{
        	consoleQuery(finalQuery, parameters);
    	}

    wrapCall.run(sqliteDb, finalQuery, parameters).then((runResult) =>
    {
        if (logQuery) console.log('Row inserted successfully.');
        resolve(runResult.lastID);
    })
    .catch(reject);
});


module.exports = insert;
