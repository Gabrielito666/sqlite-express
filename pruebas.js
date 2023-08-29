sqliteExpress = require('./index');
const db = sqliteExpress.createDB('data.db');
const ndb = sqliteExpress.createDB('noticias.db');

//sqliteExpress.createTable(db, 'personas', {nombre : 'text', ciudad : 'text', edad : 'integer'});

/*
sqliteExpress.insert(db, 'personas', {nombre : 'Gabriel', ciudad : ['vilcún', 'santaigo'], edad : 30});
sqliteExpress.insert(db, 'personas', {nombre : 'Anto', ciudad : ['santaigo'], edad : 26});
sqliteExpress.insert(db, 'personas', {nombre : 'Alonso', ciudad : ['vilcún'], edad : 20});
sqliteExpress.insert(db, 'personas', {nombre : 'Erica', ciudad : ['vilcún', 'santaigo'], edad : 56});
sqliteExpress.insert(db, 'personas', {nombre : 'Rodrigo', ciudad : ['vilcún', 'santaigo'], edad : 55});
sqliteExpress.insert(db, 'personas', {nombre : 'Paola', ciudad : ['vilcún', 'santaigo', 'aysen'], edad : 55});
sqliteExpress.insert(db, 'personas', {nombre : 'Astrid', ciudad : ['melburn', 'aysen'], edad : 40});
*/

//sqliteExpress.update(db, 'personas', {ciudad : (x)=>{return [...x, 'londres']}, edad : (x)=>{return (x + 100)}}, {nombre : 'Gabriel', OR : {edad : 30, ciudad : 'hola'}});

//sqliteExpress.update(ndb, 'noticias', {publicada : (x)=>{return !x}}, {nombre : 'pruebaMus'});

const query =
{
    db : db,
    table : 'personas',
    columns : '*',
    where : 
    {
        edad :
        [
            {
                operator : '>',
                value : 100
            },
            {
                operator : '<=',
                value : 34
            }
        ]
    },
    conector : 'OR'
}



hola = async()=>{
    console.log(await sqliteExpress.select(db, 'personas', '*', {edad : [{operator : '>', value : 100}, {operator : '<=', value : 34}]}, 'OR'));
    console.log(await sqliteExpress.select(query))
}


hola()

const objUp = {
    db : db,
    table : 'personas',
    update : {nombre : 'gabriel'},
    where : [{nombre : 'miguel'}, {edad : {operator : '<=', value : '40'}}],
    conector : 'OR'
}

sqliteExpress.update(objUp);

