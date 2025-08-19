/**
 * @typedef {import("lib/types").Parameters} Parameters
*/

/**@type {import("./types").NormalizeParametersFunction}*/
const normalizeParameters = (parameters={}) =>
{
    if(Array.isArray(parameters))
    {
        return parameters;
    }
    // Crear un nuevo objeto solo con propiedades que tienen @
    /**@type {Parameters}*/
    const normalized = {};
 
    Object.keys(parameters).forEach(key => {
        if (key.startsWith('@') && parameters[key] !== undefined)
        {
            // Si ya tiene @, mantenerla tal como está
            normalized[key] = parameters[key];
        } else if(parameters[key] !== undefined)
        {
            // Si no tiene @, agregar la versión con @
            const normalizedKey = `@${key}`;
            normalized[normalizedKey] = parameters[key];
        }
    });
    
    return normalized;
};

module.exports = normalizeParameters;