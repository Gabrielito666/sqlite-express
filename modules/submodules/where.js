const is = require('./is');
module.exports = {
	query : (where)=>{
		function armarCondicion(obj, conector, arrayCondiciones){
			let condicion;
			cols =Object.keys(obj)
			cols.forEach(col=>{
				if(is.o(obj[col]) && !is.a(obj[col])){condicion = armarCondicion(obj[col], col, [])}
				else if(is.a(obj[col])){condicion = obj[col].map(x=>`${col} = ?`).join(` ${conector} `)}
				else{condicion  =  `${col} = ?`}
				arrayCondiciones.push(condicion);
			});
			return `(${arrayCondiciones.join(` ${conector} `)})`;
		}
		return `WHERE ${armarCondicion(where, 'AND', [])}`;
	},
	placeHolders : (where)=>{
		function plaseHoldersOrdenados(obj) {
			let valores = [];
			for (let clave in obj) {
				if (is.o(obj[clave])) {valores = valores.concat(plaseHoldersOrdenados(obj[clave]));} 
				else {valores.push(obj[clave]);}
			}; return valores;
		}
		return plaseHoldersOrdenados(where); 
	}
}
