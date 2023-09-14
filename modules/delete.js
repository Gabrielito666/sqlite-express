const consoleQuery = require('./submodules/consoleQuery');
const is = require('./submodules/is');
const whereConstructor = require('./submodules/where');
module.exports = (arg1, table, where, conector) => {
  let db;
  if(is.db(arg1)){
    db = arg1;
  }else{
    ({db, table, where, conector='AND'} = arg1);
  } 
  return new Promise((resolve, reject) => {
    let finalQuery = `DELETE FROM ${table} ${whereConstructor.query(where, conector)}`;
    let placeHolders = whereConstructor.placeHolders(where, conector);
    consoleQuery(finalQuery, placeHolders)
    db.run(finalQuery, placeHolders, function (err) {
      if (err) {reject(err);}
      else{resolve({ deletedRows: this.changes });}
    });
  });
};