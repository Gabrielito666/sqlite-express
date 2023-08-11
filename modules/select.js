const signs = require('./submodules/signos');
const is = require('./submodules/is');
const whereConstructor = require('./submodules/where');
const procecedRows = require('./submodules/procecedRows');

module.exports = async (db, table, col, where, conect) => {
  return await new Promise((resolve, reject) => {
    db.all(`SELECT ${col} FROM ${table} ${whereConstructor.query(where, conect)}`, whereConstructor.placeHolders(where), function(err, rows) {
      if (err) {reject(err);} 
      else {resolve(rows);}                               
    });
  });
};
