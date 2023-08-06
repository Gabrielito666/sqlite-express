const select = require('./select');
const whereConstructor = require('./submodules/where');
const is = require('./submodules/is');
module.exports = async(db, table, update, where, conect) => {

    let placeHolders = [];
    let upCols = Object.keys(update);
    let upArray =[];

    for (let upCol of upCols) {
        let dataInsert = update[upCol];
        let arrCase = [];
        let isAFunction = false;
        if(is.f(dataInsert)){
            isAFunction = true;
            let originalData = await select(db, table, `ROWID, ${upCol}`, where, conect);
            console.log(originalData)
            arrCase.push('CASE');
            let arrDataInsert = [];
            originalData.forEach(row=>{
                arrCase.push(`WHEN ROWID = ${row.rowid} THEN ?`);
                arrDataInsert.push(strngifyData(dataInsert(parseData(row[upCol]))));
            })
            arrCase.push(`ELSE ${upCol} END`);
            dataInsert = arrDataInsert
        }else{dataInsert = [strngifyData(dataInsert)];};
        
        upArray.push(`${upCol} = ${isAFunction ? arrCase.join(' ') : '?'}`);
        placeHolders = [...placeHolders, ...dataInsert];
    }
    placeHolders = [...placeHolders, ...whereConstructor.placeHolders(where)];
        console.log(`UPDATE ${table} SET ${upArray.join(', ')} ${whereConstructor.query(where, conect)}`)
        console.log(placeHolders);
    db.run(`UPDATE ${table} SET ${upArray.join(', ')} ${whereConstructor.query(where, conect)}`, placeHolders, function(err) {
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