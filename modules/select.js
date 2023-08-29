const whereConstructor = require('./submodules/where');
const is = require('./submodules/is');
const consoleQuery = require('./submodules/consoleQuery');
module.exports = async (arg1, table, columns, where, conector) => {
  let db;
  if(is.db(arg1)){
    db = arg1;
  }else{
    ({db, table, columns, where, conector} = arg1);
  }
  columns = is.a(columns) ? columns.join(', ') : columns;
  return await new Promise((resolve, reject) => {
    let finalQuery = `SELECT ${columns} FROM ${table} ${whereConstructor.query(where, conector)}`;
    let placeHolders = whereConstructor.placeHolders(where);
    consoleQuery(finalQuery, placeHolders);
    db.all(finalQuery, placeHolders, function(err, rows) {
      if(err){reject(err);}else{resolve(rows);};                            
    });
  });
};
