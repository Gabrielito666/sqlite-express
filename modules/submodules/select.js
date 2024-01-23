const is = require('./is');
const getSelect = select => {
    if(is.a( select )) return processArrSelect(select);
    else if(is.o( select )) return processObjSelect(select);
    else return select;
};

const processObjSelect = obj => {
    const table = obj.table ? `${ obj.table }.` : '';
    const column = obj.column;
    const as = obj.as ? ` AS ${ obj.as }` : '';
    return `${ table }${ column }${ as }`;
}
const processArrSelect = arr => arr.map(select => getSelect(select)).join(', ');

module.exports = getSelect;