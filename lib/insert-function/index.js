const consoleQuery = require('../console-query');

/**
 * @typedef {import("./types").InsertFunction} InsertFunction;
*/
/**@type {InsertFunction}*/
const insert = ({ db, table, row, logQuery }) =>
    new Promise((resolve, reject) =>
    {
        const cols = Object.keys(row);
        /**@type {Record<string, any>}*/
        const parameters = {};

        cols.forEach(col =>
        {
            let value = row[col];
            if (typeof value === 'object' && value !== null)
            {
                value = JSON.stringify(value);
            }
            if (typeof value === 'boolean')
            {
                value = value.toString();
            }
            parameters[`@${col}`] = value;
        });

        const columnsString = cols.join(', ');
        const valuesString = cols.map(col => `@${col}`).join(', ');

        const finalQuery = `INSERT INTO ${table} (${columnsString}) VALUES(${valuesString})`;

        if (logQuery)
        {
            consoleQuery(finalQuery, parameters);
        }

        db.run(finalQuery, parameters,
            /**
             * @param {Error|null} err
             * @this {any}
             */
            function (err)
            {
                if (err)
                {
                    reject(err);
                }
                else
                {
                    if (logQuery)
                    {
                        console.log('Row inserted successfully.');
                    }
                    resolve(this.lastID);
                }
            }
        );
    });


module.exports = insert;