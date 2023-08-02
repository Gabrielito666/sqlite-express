const signs = require('./submodules/signos');
const is = require('./submodules/is');
module.exports = (db, table, data) => {
    return new Promise((resolve, reject) => {
        let cols = Object.keys(data);
        let values = Object.values(data);
        values.forEach((value, index) => {
            if (is.o(value)) {values[index] = JSON.stringify(value);}
            if (is.b(value)) {values[index] = value.toString();}
        });

        db.run(`INSERT INTO ${table}(${cols.join(', ')}) VALUES(${signs(values.length)})`, values, function(err) {
            if (err) {
                reject(err);
            } else {
                console.log('Data inserted successfully.');
                resolve({ insertedId: this.lastID });
            }
        });
    });
};
