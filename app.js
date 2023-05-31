const paquete = require('./index');
const data = paquete.create.db("/data.db");

paquete.create.table(data, "la_tabla", {nombre : "text", edad : "integer", ciudad : "text"})

paquete.insert(data, "la_tabla", {nombre : "anto", edad : 26, ciudad : "santiago"})


async function hola (){
    let esto =await paquete.select(data, "la_tabla", "edad", {nombre : "gabriel"})
    console.log(esto)
}

hola()