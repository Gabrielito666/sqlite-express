const select = require('./select');
const whereConstructor = require('./submodules/where');
const is = require('./submodules/is')
module.exports = async(db, table, update, where, conect) => {

    let placeHolders = [];
    let upCols = Object.keys(update);
    let upArray =[];

    for (let upCol of upCols) {
        upArray.push(`${upCol} = ?`);
        let dataInsert = update[upCol];
        if(is.f(dataInsert)){
            let originalData = await select(db, table, upCol, where);
            dataInsert = dataInsert(originalData);
        }
        if(is.b(dataInsert)){dataInsert = dataInsert.toString()};
        if(is.o(dataInsert)){dataInsert = JSON.stringify(dataInsert)};
    
        placeHolders.push(dataInsert);
    }
    conect = conect === undefined ? 'AND' : conect;
    placeHolders = [...placeHolders, ...whereConstructor.placeHolders(where)];    
    db.run(`UPDATE ${table} SET ${upArray.join()} ${whereConstructor.query(where, conect)}`, placeHolders, function(err) {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log(`Row updated successfully in table ${table}.`);
    });
};