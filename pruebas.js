sqliteExpress = require('./index');

const db = sqliteExpress.createDB('data.db');

sqliteExpress.createTable(db, 'personas', {nombre : 'text', ciudad : 'text', edad : 'integer'});

sqliteExpress.update(db, 'personas', {nombre : 'erica', edad : 58, ciudad : 'vilcun'}, {nombre : 'Antonia'})

