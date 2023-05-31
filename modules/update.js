module.exports = (db, tabla, objColDat, where)=>{
    let columna = Object.keys(objColDat)[0];
    let datoInsertar = objColDat[columna];
    let referencia_columna = Object.keys(where)[0];
    let referencia_dato = where[referencia_columna]
    db.run(`UPDATE ${tabla} set ${columna} = (?) WHERE ${referencia_columna} = (?)`, [datoInsertar, referencia_dato]);
};