const signs = require('./submodules/signos');
const is = require('./submodules/is');
const whereConstructor = require('./submodules/where');
const procecedRows = require('./submodules/procecedRows');

module.exports = async (db, table, col, where, conect) => {
  return await new Promise((resolve, reject) => {
    console.log(`SELECT ${col} FROM ${table} ${whereConstructor.query(where, conect)}`)
    db.all(`SELECT ${col} FROM ${table} ${where !== undefined && where !== null ? whereConstructor.query(where, conect) : ''}`, where !== undefined && where !== null ? whereConstructor.placeHolders(where) : [], function(err, rows) {
      if (err) {reject(err);} 
      else {resolve(rows);}                               
    });
  });
};
