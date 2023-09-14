sqliteExpress = require('./index');
const db = sqliteExpress.createDB('data.db');

const dbTable = { db : db, table : 'personas' }
//creación de tabla

sqliteExpress.createTable({ db : db, name : 'personas', columns : {nombre : 'text', edad : 'integer', amigos  : 'text' } });
//sqliteExpress.createTable({ db : db, name : 'locos', columns : {nombre : 'text', edad : 'integer', amigos  : 'text' } });


//insersion de datos

/*
    sqliteExpress.insert({...dbTable, row : { nombre : 'Gabriel', edad : 23, amigos : ['Brandon', 'Álvaro'] }});
    sqliteExpress.insert({...dbTable, row : { nombre : 'Antonia', edad : 26, amigos : ['Javi', 'Natali'] }});
    sqliteExpress.insert({...dbTable, row : { nombre : 'Alonso', edad : 21, amigos : ['undefined'] }});
*/

//actualización de datos

sqliteExpress.update({...dbTable, update : {amigos : (x)=>[...x, 'dios']}, where : { nombre : ['Gabriel', 'Antonia'] }, conector : 'OR'})

//eliminación de datos

//sqliteExpress.delete({...dbTable, where : {edad : {operator : '>', value : 1}}});