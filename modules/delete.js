const consoleQuery = require('./submodules/consoleQuery');
module.exports = (arg1, table, where) => {
    let db;
    if(is.db(arg1)){
      db = arg1;
    }else{
      ({db, table, where} = arg1);
    } 
    return new Promise((resolve, reject) => {
        let colCondition = Object.keys(where)[0];
        let valueCondition = where[colCondition];
        let finalQuery = `DELETE FROM ${table} WHERE ${colCondition} = ?`;
        consoleQuery(finalQuery, valueCondition)
        db.run(finalQuery, valueCondition, function (err) {
            if (err) {reject(err);}
            else{resolve({ deletedRows: this.changes });}
        });
    });
};
