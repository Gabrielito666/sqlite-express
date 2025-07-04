const select = require( './select' );
const whereConstructor = require( '../submodules/where' );
const is = require( '../submodules/is' );
const consoleQuery = require( '../submodules/consoleQuery' );

/**@typedef {import("../types/methods.d.ts").UpdateFunction} UpdateFunction*/

/**@type {UpdateFunction} */
const update = ({ db, table, update, where, connector, logQuery }) =>
{
    return new Promise(async(resolve, reject) =>
    {
        let [placeHolders, upCols, upArray] = [[], Object.keys( update ), []];
    
        for (let upCol of upCols)
        {
            let dataInsert = update[upCol];
            const arrCase = [];
            let isAFunction = false;
            if(is.f(dataInsert))
            {
                isAFunction = true;

                const originalData = await select({
                    db : db,
                    table : table,
                    select : `ROWID, ${upCol}`,
                    where : where,
                    connector : connector,
                    processColumns : false,
                    processRows : false,
                    logQuery : false,
                    emptyResult: undefined,
                });
                arrCase.push('CASE');
                const arrDataInsert = [];
                
                originalData.forEach(row =>
                {
                    arrCase.push(`WHEN ROWID = ${row[Object.keys(row)[0]]} THEN ?`);
                    arrDataInsert.push(strngifyData(dataInsert(parseData(row[upCol]))));
                })
                arrCase.push(`ELSE ${upCol} END`);
                dataInsert = arrDataInsert
            }
            else
            {
                dataInsert = [strngifyData(dataInsert)];
            };
            upArray.push(`${upCol} = ${isAFunction ? arrCase.join(' ') : '?'}`);
            placeHolders = [ ...placeHolders, ...dataInsert ];
        }
        placeHolders = [ ...placeHolders, ...whereConstructor.placeHolders(where) ];
        
        const finalQuery = `UPDATE ${table} SET ${upArray.join(', ')} ${whereConstructor.query(where, connector)}`;
        if (logQuery) consoleQuery(finalQuery, placeHolders);
        
        db.run(finalQuery, placeHolders, function(err)
        {
            if (err)
            {
                console.error(err.message);
                reject(err);
                return;
            }
            if (logQuery) console.log(`Row updated successfully in table ${table}.`);
            resolve(this.changes);
        });
    
        function strngifyData (data)
        {
            if(is.b(data)){ return data.toString() };
            if(is.o(data)){ return JSON.stringify(data) };
            return data;
        }
        function parseData (data)
        {
            if(data === 'true'){ return true }
            if(data === 'false'){ return false }
            if(is.j(data)){ return JSON.parse(data) };
            return data;
        }
    })
};

module.exports = update;