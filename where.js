const where = 
{
	a : 'b',
	c : 'd',
		OR : {
			e : 'f',
			g : 'h'
		} ,
	i : 'j'
}

function armarCondicion(obj, conector){
	let = arrayCondiciones =[];
	let condicion;
	cols =Object.keys(obj)
	cols.forEach(col=>{
		if(esObjeto(obj[col])){
			condicion = armarCondicion(obj[col], col)
		}else{
			condicion  =  `${col} = ?`
		}
		arrayCondiciones.push(condicion);
	});
	return `(${arrayCondiciones.join(` ${conector} `)})`

}


function esObjeto(x){
	return typeof x === 'object' && x !== null
}

console.log(`WHERE ${armarCondicion(where, 'AND')}`)
