module.exports = (db, name, cols)=>{
    let array = Object.entries(cols);
    let partCols = array.map(col => `${col[0]} ${col[1]}`);
    let string = partCols.join(',');
    db.run(`CREATE TABLE IF NOT EXISTS ${name} (${string})`);
}