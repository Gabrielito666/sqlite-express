const whereConstructor = require( '../submodules/where' );
const joinConstructor = require( '../submodules/join' );
const selectConstructor = require( '../submodules/select' );
const consoleQuery = require( '../submodules/consoleQuery' );
const processResult = require( '../submodules/processResult' );

/**@typedef {import("../types/methods.d.ts").SelectFunction} SelectFunction*/
/**@type {SelectFunction}*/
const select = ({ db, table, select, where, connector, processColumns, processRows, emptyResult, logQuery, join }) => {

  select = selectConstructor(select);

  return new Promise((resolve, reject) =>
  {
    const finalQuery = `SELECT ${select} FROM ${table} ${joinConstructor({ table, join })} ${whereConstructor.query(where, connector)}`;
    const placeHolders = whereConstructor.placeHolders(where);
    if (logQuery) consoleQuery(finalQuery, placeHolders);

    db.all(finalQuery, placeHolders, function(err, rows)
    {
      if(err)
      {
        reject(err);
      }
      else
      {
        resolve
        (
          (processColumns || processRows) ? processResult(rows, processColumns, processRows, emptyResult) : rows
        );
      };
    });
  });
};

module.exports = select;