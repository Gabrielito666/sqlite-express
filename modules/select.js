const signs = require('./submodules/signos');
const is = require('./submodules/is');

module.exports = async (db, table, col, where) => {
  let whereString = "";
  let signsString, whereData;

  if (where !== undefined) {
    let whereColumn = Object.keys(where)[0];
    whereData = where[whereColumn];
    
    if (is.a(whereData)){
      signsString = `IN (${signs(whereData.length)})`;
      whereString = `WHERE ${whereColumn} ${signsString}`;
    }else {
      signsString = '= ?';
      whereString = `WHERE ${whereColumn} ${signsString}`;
    }
  }
  return await new Promise((resolve, reject) => {
    db.all(`SELECT ${col} FROM ${table} ${whereString}`, whereData, function(err, rows) {
      if (err) {reject(err);} 
      else {resolve(procecedRows(rows));}
    });
  });
  function procecedRows(rows){
    let oneRow, oneColumn;
    if(rows.length === 0){return undefined};
    if(rows.length === 1){oneRow = true}else{oneRow = false};
    if(Object.keys(rows[0]).length === 1){oneColumn = true}else{oneColumn = false};

    rows.forEach(row=>{Object.keys(row).forEach(prop =>{if(is.j(row[prop])){row[prop]=JSON.parse(row[prop])}})})

    if(oneColumn){rows = rows.map(row => row[Object.keys(row)[0]])};
    if(oneRow){rows = rows[0]};
    return rows;
  }
};