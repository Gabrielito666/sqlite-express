const consoleQuery = require('../submodules/consoleQuery');
const whereConstructor = require('../submodules/where');

/**@typedef {import("../types/methods.d.ts").CountFunction} CountFunction*/
/**@type {CountFunction}*/
const count = ({ db, table, where, connector, logQuery }) =>
{
    return new Promise((resolve, reject) =>
    {
        const finalQuery = `SELECT COUNT(*) FROM ${table} ${whereConstructor.query(where, connector)}`;
        const placeHolders = whereConstructor.placeHolders(where);
        if(logQuery) consoleQuery(finalQuery, placeHolders);
        db.get(finalQuery, placeHolders, function(err, count)
        {
            if (err)
            {
                reject(err);
            }
            else
            {
                if(logQuery) console.log('Existence verification performed.');
                resolve(count['COUNT(*)']);
            }
        });
    });
};

module.exports = count;