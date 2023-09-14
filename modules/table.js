const is = require('./submodules/is');
const consoleQuery = require('./submodules/consoleQuery');
module.exports = (arg1, name, columns) => {
  let db;
  if(is.db(arg1)){
    db = arg1;
  }else{
    ({db, name, columns} = arg1);
  }

  let array = Object.entries(columns);
  let partCols = array.map(col => `${col[0]} ${col[1]}`);
  let string = partCols.join(', ');
  let finalQuery = `CREATE TABLE IF NOT EXISTS ${name} (${string})`;
  consoleQuery(finalQuery);
  db.run(finalQuery, function(err) {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log(`Checked table '${name}'. Created if it did not exist.`);
  });
};