const signs = require('./signos');

module.exports = async (db, table, col, where) => {
  let whereString = "";
  let signsString;
  let whereData;

  if (where !== undefined) {
    let whereColumn = Object.keys(where)[0];
    whereData = where[whereColumn];
    
    if (Array.isArray(whereData)) {
      signsString = `IN (${signs(whereData.length)})`;
      whereString = `WHERE ${whereColumn} ${signsString}`;
    }else {
      signsString = '= ?';
      whereString = `WHERE ${whereColumn} ${signsString}`;
    }
  }
  return await new Promise((resolve, reject) => {
    db.all(`SELECT ${col} FROM ${table} ${whereString}`, whereData, function(err, rows) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};
