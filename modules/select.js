const whereConstructor = require('./submodules/where');

module.exports = async (db, table, col, where, conect) => {
  return await new Promise((resolve, reject) => {
    console.log(`SELECT ${col} FROM ${table} ${whereConstructor.query(where, conect)}`);
    db.all(`SELECT ${col} FROM ${table} ${whereConstructor.query(where, conect)}`, whereConstructor.placeHolders(where), function(err, rows) {
      if(err){reject(err);}else{resolve(rows);};                            
    });
  });
};
