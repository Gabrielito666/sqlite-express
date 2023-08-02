sqliteExpress = require('./index');
const whereConstructor = require('./modules/submodules/where')

const db = sqliteExpress.createDB('data.db');

sqliteExpress.createTable(db, 'personas', {nombre : 'text', ciudad : 'text', edad : 'integer'});

//sqliteExpress.delete(db, 'personas', {nombre : 'x'});sqliteExpress.delete(db, 'personas', {nombre : 'y'})


//for(i=0;i<10;i++){sqliteExpress.insert(db, 'personas', {nombre : 'x', edad : i, ciudad : []});sqliteExpress.insert(db, 'personas', {nombre : 'y', edad : i, ciudad : []})}


//sqliteExpress.update(db, 'personas', {ciudad : (x)=>{return [...x, 'santiago']}}, {edad : 5, nombre : 'y', AND : {ciudad : []}}, 'OR');

//PARECE QUE HACE FALTA UN MONTón


sqliteExpress.update(db, 'personas', {ciudad : 'holis'}, {edad : 5})