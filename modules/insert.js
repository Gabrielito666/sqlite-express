const signos = require('./signos')
module.exports = (db, table, data)=>{
    let cols = Object.keys(data);
    let values = Object.values(data);
    db.run(`INSERT INTO ${table}(${cols.join(', ')}) VALUES(${signos(values.length)})`, values, function(err) {if(err){console.log("no se pudo insertar"); console.log(err);}});
};