module.exports = (db, tabla, where)=>{
    let columnaCondicion = Object.keys(where)[0];
    let valor_condicion = where[columnaCondicion];
    db.run(`DELETE FROM ${tabla} WHERE ${columnaCondicion} = ?`, valor_condicion, function (err) {if (err) {return console.error(err.message);}})
}