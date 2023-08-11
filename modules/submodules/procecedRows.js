const is = require('./is');
module.exports = (rows)=>{
    if(rows.length === 0){return undefined};
    let oneRow = rows.length === 1
    let oneColumn = Object.keys(rows[0]).length === 1;
    rows.forEach(row=>{Object.keys(row).forEach(prop =>{if(is.j(row[prop])){row[prop]=JSON.parse(row[prop])}})})
    if(oneColumn){rows = rows.map(row => row[Object.keys(row)[0]])};
    if(oneRow){rows = rows[0]};
    return rows;
};