module.exports = (db, table, objColDat, where) => {
    let col = Object.keys(objColDat)[0];
    let dataInsert = objColDat[col];
    let colReference = Object.keys(where)[0];
    let dataReference = where[colReference];
    db.run(`UPDATE ${table} SET ${col} = ? WHERE ${colReference} = ?`, [dataInsert, dataReference], function(err) {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log(`Row updated successfully in table ${table}.`);
    });
};
