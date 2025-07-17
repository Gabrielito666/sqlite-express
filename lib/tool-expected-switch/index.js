/**
 * @typedef {import("./types.d.ts").ExpectedSwitchFunction} ExpectedSwitchFunction
 */
/**@type {ExpectedSwitchFunction}*/
const expectedSwitch = ({ db, query, parameters, expected, logQuery }) =>
new Promise((resolve, reject) =>
{
    if (expected === "celd")
    {
        db.sqliteDb.get(query, parameters, function(err, row)
        {
            if (err)
            {
                reject(err);
            }
            else
            {
                if (logQuery) console.log("Query executed successfully");
                if (!row || Object.keys(row).length === 0)
                {
                    //@ts-ignore
                    resolve(null);
                }
                else
                {
                    resolve(Object.values(row)[0]);
                }
            }
        });
    }
    else if (expected === "row")
    {
        db.sqliteDb.get(query, parameters, function(err, row)
        {
            if (err)
            {
                reject(err);
            }
            else
            {
                if (logQuery) console.log("Query executed successfully");
                resolve(row || null);
            }
        });
    }
    else if (expected === "column")
    {
        db.sqliteDb.all(query, parameters, function(err, rows)
        {
            if (err)
            {
                reject(err);
            }
            else
            {
                if (logQuery) console.log("Query executed successfully");
                if (rows.length > 0)
                {
                    const column = Object.keys(rows[0])[0];
                    if (column)
                    {
                        const result = rows.map(row => row[column]);
                        //@ts-ignore
                        resolve(result);
                    }
                    else
                    {
                        //@ts-ignore
                        resolve([]);
                    }
                }
                else
                {
                    //@ts-ignore
                    resolve([]);
                }
            }
        });
    }
    else if (expected === "rows")
    {
        db.sqliteDb.all(query, parameters, function(err, rows)
        {
            if (err)
            {
                reject(err);
            }
            else
            {
                if (logQuery) console.log("Query executed successfully");
                //@ts-ignore
                resolve(rows);
            }
        });
    }
});

module.exports = expectedSwitch;