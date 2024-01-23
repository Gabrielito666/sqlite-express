const is = require('./is'); 

const getJoins = joins => {
    if(is.a(joins)) return joins;
    else if(is.o(joins)) return [ joins ];
};

const getColumns = on =>{
    if(is.a(on)) {console.log('es array') ;return on; }
    else if(is.o(on)) return getColumns(on.columns);
    else if(is.s(on)) return [ on, on ];
    else throw new Error('Ivalid format from join: On must be an array, object or string');
}

const join = ({ table, join }) => {

    if(join){
        join = getJoins(join);

        const sentences = join.map(j => {
            const type = j.type ? j.type : 'INNER';
            const stringTypeJoin = ` ${ type } JOIN `;
            const columns = getColumns(j.on)
            const operator = j.on.operator ? j.on.operator : '=';
            return `${ stringTypeJoin } ${ j.table } ON ${ table }.${ columns[0] } ${ operator } ${ j.table }.${ columns[1] }`;
        }).join(' ');
    
        return sentences;
    }else{
        return '';
    }
};
module.exports = join;