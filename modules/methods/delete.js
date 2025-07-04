const consoleQuery = require('../submodules/consoleQuery');
const whereConstructor = require('../submodules/where');

/**@typedef {import("../types/methods.d.ts").DeleteFunction} DeleteFunction*/
/**@type {DeleteFunction}*/
const deleteFunc = ({ db, table, where, connector, logQuery }) =>
{
  return new Promise((resolve, reject) =>
  {
    let finalQuery = `DELETE FROM ${table} ${whereConstructor.query(where, connector)}`;
    let placeHolders = whereConstructor.placeHolders(where);
    if(logQuery) consoleQuery(finalQuery, placeHolders);
    
    db.run(finalQuery, placeHolders, function (err)
    {
      if (err)
      {
        console.error(err);
        reject(err);
      }
      else
      {
        resolve(this.changes);
      }
    });
  });
};

module.exports = deleteFunc;