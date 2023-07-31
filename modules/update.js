const select = require('./select');
module.exports = async(db, table, update, where) => {


    let placeHolders = [];
    let upCols = Object.keys(update);
    let upArray =[];

    for (let upCol of upCols) {
        upArray.push(`${upCol} = ?`);
    
        let dataInsert = update[upCol];
    
        if(esFuncion(dataInsert)){
            let originalData = await select(db, table, upCol, where);
            dataInsert = dataInsert(originalData);
        }
        if(esBooleano(dataInsert)){dataInsert = dataInsert.toString()};
        if(esObjeto(dataInsert)){dataInsert = JSON.stringify(dataInsert)};
    
        placeHolders.push(dataInsert);
    }

    let whereCols = Object.keys(where);
    let whereArray =[];
    
    whereCols.forEach(whereCol => {
        whereArray.push(`${whereCol} = ?`);
        placeHolders.push(where[whereCol]);
    });

    db.run(`UPDATE ${table} SET ${upArray.join()} WHERE ${whereArray.join(' AND ')}`, placeHolders, function(err) {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log(`Row updated successfully in table ${table}.`);
    });
    function esFuncion(parametro) {return typeof parametro === 'function';};
    function esObjeto(parametro) {return typeof parametro === 'object' && parametro !== null;};
    function esBooleano(parametro) {return typeof parametro === 'boolean';};
};
