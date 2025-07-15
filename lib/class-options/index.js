/**
 * @typedef {import("./types.js").OptionsClass} OptionsClass
 * @typedef {import("./types.js").OptionsConstructorMethod} OptionsConstructorMethod
 * @typedef {import("./types.js").OptionsSetMethod} OptionsSetMethod
 * @typedef {import("./types.js").ExpectedParam} ExpectedParam
 * @typedef {import("./types.js").TypeParam} TypeParam
 * @typedef {import("./types.js").OptionsType<ExpectedParam, TypeParam>} OptionsType
 * @typedef {import("./types.js").OptionsSetParams} OptionsSetParams
 * @typedef {import("./types.js").ConnectorParam} ConnectorParam
 * @typedef {import("./types.js").SelectParam} SelectParam
 * @typedef {import("./types.js").OptionsCombinationMethod} OptionsCombinationMethod
*/

/**@type {("route"|"db"|"table"|"where"|"columns"|"select"|"connector"|"update"|"row"|"logQuery"|"query"|"expected"|"parameters"|"type")[]}*/
const paramsKeys = [
    'route',
    'db',
    'table',
    'where',
    'columns',
    'select',
    'connector',
    'update',
    'row',
    'logQuery',
    'query',
    'expected',
    'parameters',
    'type'
]

/**
 * @type {OptionsClass}
 */
const Options = class
{
    /**
     * @type {OptionsConstructorMethod}
     * @this {OptionsType}
    */
    constructor(context, route)
    {
        this._context = context;
        this.rootPath = route;
        this.route; 
        this.db;
        this.table;
        this.where;
        this.columns;
        /**@type {SelectParam}*/
        this.select = '*';
        /**@type {ConnectorParam}*/
        this.connector = 'AND';
        this.update;
        this.row;
        this.logQuery = false;
        this.query = "";
        this.expected = 'rows';
        this.parameters = {};
        this.type = 'any';
    }

    /**
     * @type {OptionsSetMethod}
     */
    set(options = {})
    {
        
        paramsKeys.forEach(property => 
        { 
            if (options.hasOwnProperty(property)) 
            { 
                //@ts-ignore
                this[property] = options[property]; 
            } 
        });
    }
    
    /**@type {OptionsCombinationMethod}*/
    combination(...options)
    {
        const newOptions = new Options(this._context, this.rootPath);
        for(let i = options.length - 1; i >= 0; i--)
        {
            const option = options[i];
            if (option) {
                const params = {};
                paramsKeys.forEach(key => {
                    if (option[key] !== undefined) {
                        // @ts-ignore
                        params[key] = option[key];
                    }
                });
                newOptions.set(params);
            }
        }
        return newOptions;
    }
};

module.exports = Options;