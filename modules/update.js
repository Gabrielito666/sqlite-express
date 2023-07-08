const select = require('./select');
module.exports = async(db, table, objColDat, where) => {
    let col = Object.keys(objColDat)[0];
    let dataInsert = objColDat[col];
    if(esFuncion(dataInsert)){
        let originalData = await select(db, table, col, where);
        dataInsert = dataInsert(originalData);
    }

    if(esBooleano(dataInsert)){dataInsert = dataInsert.toString()};
    if(esObjeto(dataInsert)){dataInsert = JSON.stringify(dataInsert)};

    let colReference = Object.keys(where)[0];
    let dataReference = where[colReference];
    db.run(`UPDATE ${table} SET ${col} = ? WHERE ${colReference} = ?`, [dataInsert, dataReference], function(err) {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log(`Row updated successfully in table ${table}.`);
    });
    function esFuncion(parametro) {return typeof parametro === 'function';}
    function esObjeto(parametro) {
        return typeof parametro === 'object' && parametro !== null;
    }
    function esBooleano(parametro) {
        return typeof parametro === 'boolean';
    }
};
