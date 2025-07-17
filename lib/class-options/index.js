/**
 * @typedef {import("./types.js").OptionsClass} OptionsClass
 * @typedef {import("./types.js").OptionsType} OptionsType
 * @typedef {import("../types/params").Params} Params
 * @typedef {import("./types.js").OptionalOptions} OptionalOptions
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
     * @param {ConstructorParameters<OptionsClass>[0]} options
     * @this {OptionsType}
    */
    constructor(options = [])
    {
        /**@type {OptionsType["route"]}*/
        this.route; 
        /**@type {OptionsType["db"]}*/
        this.db;
        /**@type {OptionsType["table"]}*/
        this.table;
        /**@type {Params["where"]}*/
        this.where = undefined;
        /**@type {OptionsType["columns"]}*/
        this.columns;
        /**@type {Params["select"]}*/
        this.select = '*';
        /**@type {Params["connector"]}*/
        this.connector = 'AND';
        /**@type {OptionsType["update"]}*/
        this.update;
        /**@type {OptionsType["row"]}*/
        this.row;
        /**@type {OptionsType["logQuery"]}*/
        this.logQuery = false;
        /**@type {OptionsType["query"]}*/
        this.query;
        /**@type {Params["expected"]}*/
        this.expected = 'rows';
        /**@type {OptionsType["parameters"]}*/
        this.parameters = {};
        /**@type {OptionsType["type"]}*/
        this.type = 'any';


        //EXTENDS OPTIONS
        for(let i = options.length - 1; i >= 0; i--)
        {
            const option = options[i];
            if (option)
            {
                /**@type {OptionalOptions}*/
                const params = {};
                
                paramsKeys.forEach(key => {
                    if (option[key] !== undefined)
                    {
                        //@ts-ignore
                        params[key] = option[key];
                    }
                });
                this.set(params);
            }
        }

    }

    /**
     * @type {OptionsType["set"]}
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

    /** @type {OptionsType["fix"]}*/
    fix(opName)
    {
        Object.defineProperty(this, opName, {
            value: this[opName],
            writable: false,
            configurable: false,
        });
    }
};

module.exports = Options;   