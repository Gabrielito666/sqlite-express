const signs = require('../submodules/signos');
const is = require('../submodules/is');
const consoleQuery = require('../submodules/consoleQuery');

/**
 * @typedef {import("../types/methods.d.ts").InsertFunction} InsertFunction;
*/
/**@type {InsertFunction}*/
const insert = ({ db, table, row, logQuery }) =>
{
    return new Promise((resolve, reject) =>
    {
        const cols = Object.keys(row);
        const values = Object.values(row);

        values.forEach((value, index) =>
        {
            if (is.o(value)) values[index] = JSON.stringify(value);
            if (is.b(value)) values[index] = value.toString();
        });

        const finalQuery = `INSERT INTO ${table}(${cols.join(', ')}) VALUES(${signs(values.length)})`;
        if(logQuery) consoleQuery(finalQuery, values);

        db.run(finalQuery, values, function(err)
        {
            if (err)
            {
                reject(err);
            }
            else
            {
                if(logQuery) console.log('Row inserted successfully.');
                resolve(this.changes === 1);
            }
        });
    });
};

module.exports = insert;