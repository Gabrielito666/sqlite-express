/**@type {(parameters: Record<string, any>) => Record<string, any>}*/
const normalizeParameters = (parameters) => {
    // Crear un nuevo objeto solo con propiedades que tienen @
    /**@type {Record<string, any>}*/
    const normalized = {};
    
    Object.keys(parameters).forEach(key => {
        if (key.startsWith('@')) {
            // Si ya tiene @, mantenerla tal como está
            normalized[key] = parameters[key];
        } else {
            // Si no tiene @, agregar la versión con @
            const normalizedKey = `@${key}`;
            normalized[normalizedKey] = parameters[key];
        }
    });
    
    return normalized;
};

module.exports = normalizeParameters;