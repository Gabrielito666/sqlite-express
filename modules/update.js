const select = require('./select');
module.exports = async(db, table, update, where, conect) => {
    console.log(update, where)

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

    conect = conect === undefined ? 'AND' : conect;
    placeHolders = [...placeHolders, ...plaseHoldersOrdenados(where)];    

    console.log(`UPDATE ${table} SET ${upArray.join()} WHERE ${armarWhere(where, conect)}`)
    db.run(`UPDATE ${table} SET ${upArray.join(', ')} WHERE ${armarWhere(where, conect)}`, placeHolders, function(err) {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log(`Row updated successfully in table ${table}.`);
    });
    function esFuncion(parametro) {return typeof parametro === 'function';};
    function esObjeto(parametro) {return typeof parametro === 'object' && parametro !== null;};
    function esBooleano(parametro) {return typeof parametro === 'boolean';};

    function armarWhere(condicion, conect){
        let cols = Object.keys(condicion);
        let condArray =[];
        cols.forEach(col=>{
            if(esObjeto(condicion[col])){condArray.push(armarWhere(condicion[col], col))}
            else{condArray.push(`${col} = ?`);} 
        }); return `(${condArray.join(` ${conect} `)})`
    }
    function plaseHoldersOrdenados(obj) {
        let valores = [];
        for (let clave in obj) {
            if (esObjeto(obj[clave])) {valores =  valores.concat(plaseHoldersOrdenados(obj[clave]));} 
            else {valores.push(obj[clave]);}
        }; return valores;
    }
};
