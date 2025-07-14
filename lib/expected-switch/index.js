/**@typedef {import("./types.d.ts").ExpectedSwitchFunction} ExpectedSwitchFunction*/
/**@type {ExpectedSwitchFunction}*/
const expectedSwitch = ({ db, query, parameters, expected, logQuery }) =>
new Promise((resolve, reject) =>
{
    if (expected === "celd")
    {
        db.get(query, parameters, function(err, row)
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
                    resolve(/** @type {any} */ (null));
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
        db.get(query, parameters, function(err, row)
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
        db.all(query, parameters, function(err, rows)
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
                        /** @type {any} */
                        const result = rows.map(row => row[column]);
                        resolve(result);
                    }
                    else
                    {
                        resolve(/** @type {any} */ ([]));
                    }
                }
                else
                {
                    resolve(/** @type {any} */ ([]));
                }
            }
        });
    }
    else if (expected === "rows")
    {
        db.all(query, parameters, function(err, rows)
        {
            if (err)
            {
                reject(err);
            }
            else
            {
                if (logQuery) console.log("Query executed successfully");
                resolve(/** @type {any} */ (rows));
            }
        });
    }
});

module.exports = expectedSwitch;