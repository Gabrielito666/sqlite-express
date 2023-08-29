const signs = require('./submodules/signos');
const is = require('./submodules/is');
const consoleQuery = require('./submodules/consoleQuery');
module.exports = (arg1, table, row) => {
    let db;
    if(is.db(arg1)){
      db = arg1;
    }else{
      ({db, table, row} = arg1);
    }

    return new Promise((resolve, reject) => {
        let cols = Object.keys(row);
        let values = Object.values(row);
        values.forEach((value, index) => {
            if (is.o(value)) {values[index] = JSON.stringify(value);}
            if (is.b(value)) {values[index] = value.toString();}
        });
        let finalQuery = `INSERT INTO ${table}(${cols.join(', ')}) VALUES(${signs(values.length)})`;
        consoleQuery(finalQuery, values);
        db.run(finalQuery, values, function(err) {
            if (err) {
                reject(err);
            } else {
                console.log('Row inserted successfully.');
                resolve({ insertedId: this.lastID });
            }
        });
    });
};
