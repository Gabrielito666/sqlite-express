module.exports = {
    o : ( x )=>  ( typeof x === 'object' && x !== null ),
    a : ( x )=> Array.isArray(x),
    b : ( x )=> typeof x === 'boolean',
    s : ( x )=> typeof x === 'string',
    n : ( x )=> typeof x === 'number',
    j : ( x )=>{ if( typeof x !== 'string' ){ return false }try{ JSON.parse( x ) }catch( err ){ return false }return true },
    f : ( x )=> typeof x === 'function'
}