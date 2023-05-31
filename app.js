const paquete = require('./index');
const data = paquete.create.db("/data.db");

paquete.create.table(data, "la_tabla", {nombre : "text", edad : "integer", ciudad : "text"})

paquete.delete(data, "la_tabla", {nombre : "gabriel"})
