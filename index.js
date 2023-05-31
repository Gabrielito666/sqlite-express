const path = require('path')
const sqlite3 = require('sqlite3').verbose();
const directorio = path.resolve(__dirname);

module.exports = {

    create: 
    {
        db : newDB,
        table : crearTabla,
    },
    insert : insertDB,
    select : selectDB,
    update : updateDB,
    delete : deleteDB
}

function newDB(ruta){
    return new sqlite3.Database(directorio+ruta);
}

function crearTabla(db, nombre, columnas){
    let array = Object.entries(columnas);
    let partesColumnas = array.map(columna => `${columna[0]} ${columna[1]}`);
    let string = partesColumnas.join(',');
    db.run(`CREATE TABLE IF NOT EXISTS ${nombre} (${string})`);
}

function insertDB(db, tabla, datos){

    let columnas = Object.keys(datos);
    let valores = Object.values(datos);

    db.run(`INSERT INTO ${tabla}(${columnas.join(', ')}) VALUES(${signos(valores.length)})`, valores, function(err) {if(err){console.log("no se pudo insertar"); console.log(err);}});
};
async function selectDB(db, tabla, columna, where){
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
function updateDB(db, tabla, objColDat, where){

    let columna = Object.keys(objColDat)[0];
    let datoInsertar = objColDat[columna];
    let referencia_columna = Object.keys(where)[0];
    let referencia_dato = where[referencia_columna]

    db.run(`UPDATE ${tabla} set ${columna} = (?) WHERE ${referencia_columna} = (?)`, [datoInsertar, referencia_dato]);
};
function deleteDB(db, tabla, where) {

    let columnaCondicion = Object.keys(where)[0];
    let valor_condicion = where[columnaCondicion];

    db.run(`DELETE FROM ${tabla} WHERE ${columnaCondicion} = ?`, valor_condicion, function (err) {if (err) {return console.error(err.message);}})
}
function signos(x) {
    let string = "";
    for (i = 0; i < x - 1; i++) {
      string += "?, ";
    }
    string += "?";
    return string;
}