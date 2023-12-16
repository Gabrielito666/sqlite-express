const is = require('./is');
module.exports = {
	query : (where, connector)=>{
		connector = connector === undefined ? 'AND' : connector; ///quitar
		function armarCondicion(obj, connector, arrayCondiciones){
			let condicion;
			let operator;
			let cols = Object.keys(obj);
			cols.forEach(col=>{
				operator = '=';
				if(is.o(obj[col]) && !is.a(obj[col])){
					if(obj[col].operator && obj[col].value){
						operator =  obj[col].operator;
						condicion  =  `${col} ${operator} ?`
					}else{
						condicion = armarCondicion(obj[col], col, []);
					}
				}
				else if(is.a(obj[col])){condicion = obj[col].map(x=>{
					if(is.o(x) && !is.a(x)){
						operator = (x.operator && x.value) ? x.operator : '=';
					}
					return `${col} ${operator} ?`}).join(` ${connector} `)
				}
				else{condicion  =  `${col} ${operator} ?`}
				arrayCondiciones.push(condicion);
			});
			return `(${arrayCondiciones.join(` ${connector} `)})`;
		}
		if(where === undefined || where === null){
			return '';
		}else{
			return `WHERE ${armarCondicion(where, connector, [])}`;
		}
	},
	placeHolders : (where)=>{
		function plaseHoldersOrdenados(obj) {
			let valores = [];
			for (let clave in obj) {
				if (is.o(obj[clave])){
					if(obj[clave].operator && obj[clave].value){
						valores.push(obj[clave].value)
					}else{
						valores = valores.concat(plaseHoldersOrdenados(obj[clave]));} 
					}
				else {valores.push(obj[clave]);}
			}; return valores;
		}
		if(where === undefined || where === null){
			return [];
		}else{
			return plaseHoldersOrdenados(where); 
		}
	}
}