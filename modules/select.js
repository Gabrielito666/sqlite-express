const signos = require('./signos')
module.exports = async (db, tabla, columna, where)=>{
    let stringWhere = "";
    let losSignos;
    let whereDato;
    if(where !== undefined){
        let whereColumna = Object.keys(where)[0];
        whereDato = where[whereColumna];
        
        if(Array.isArray(whereDato)){
            losSignos = `IN (${signos(whereDato.length)})`;
            stringWhere = `WHERE ${whereColumna} ${losSignos}`;
        }else{
            losSignos = '= ?';
            stringWhere = `WHERE ${whereColumna} ${losSignos}`;
        }
    }
    return await new Promise((resolve, reject) => {
        db.all(`SELECT ${columna} FROM ${tabla} ${stringWhere}`, whereDato, function(err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
    });  
}