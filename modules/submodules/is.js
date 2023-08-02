module.exports = {
    o : (x)=>{return typeof x === 'object' && x !== null},
    a : (x)=>{return Array.isArray(x)},
    b : (x)=>{return typeof parametro === 'boolean'},
    s : (x)=>{return typeof x === 'string'},
    n : (x)=>{return typeof x === 'number'},
    j : (x)=>{if(!this.s(x)){return false}try{JSON.parse(x)}catch(err){return false}return true},
    f : (x)=>{return typeof x === 'function'},
}