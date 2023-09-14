const select = require('./select');
const whereConstructor = require('./submodules/where');
const is = require('./submodules/is');
const consoleQuery = require('./submodules/consoleQuery');
module.exports = async(arg1, table, update, where, conector) => {

    let db;
    if(is.db(arg1)){
      db = arg1;
    }else{
      ({db, table, update, where, conector} = arg1);
    }

    let placeHolders = [];
    let upCols = Object.keys(update);
    let upArray =[];

    for (let upCol of upCols) {
        let dataInsert = update[upCol];
        let arrCase = [];
        let isAFunction = false;
        if(is.f(dataInsert)){
            isAFunction = true;
            let originalData = await select(db, table, `ROWID, ${upCol}`, where, conector);
            arrCase.push('CASE');
            let arrDataInsert = [];
            originalData.forEach(row=>{
                arrCase.push(`WHEN ROWID = ${row[Object.keys(row)[0]]} THEN ?`);
                arrDataInsert.push(strngifyData(dataInsert(parseData(row[upCol]))));
            })
            arrCase.push(`ELSE ${upCol} END`);
            dataInsert = arrDataInsert
        }else{dataInsert = [strngifyData(dataInsert)];};
        
        upArray.push(`${upCol} = ${isAFunction ? arrCase.join(' ') : '?'}`);
        placeHolders = [...placeHolders, ...dataInsert];
    }
    placeHolders = [...placeHolders, ...whereConstructor.placeHolders(where)];
    let finalQuery = `UPDATE ${table} SET ${upArray.join(', ')} ${whereConstructor.query(where, conector)}`;
    consoleQuery(finalQuery, placeHolders);
    db.run(finalQuery, placeHolders, function(err) {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log(`Row updated successfully in table ${table}.`);
    });

    function strngifyData (data){
        if(is.b(data)){return data.toString()};
        if(is.o(data)){return JSON.stringify(data)};
        return data;
    }
    function parseData (data){
        if(data === 'true'){return true}
        if(data === 'false'){return false}
        if(is.j(data)){return JSON.parse(data)};
        return data;
    }
};