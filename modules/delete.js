module.exports = (db, table, where) => {
    return new Promise((resolve, reject) => {
        let colCondition = Object.keys(where)[0];
        let valueCondition = where[colCondition];
        db.run(`DELETE FROM ${table} WHERE ${colCondition} = ?`, valueCondition, function (err) {
            if (err) {reject(err);}
            else{resolve({ deletedRows: this.changes });}
        });
    });
};
