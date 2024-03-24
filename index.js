const newDB = require('./modules/methods/db');
const DefaultOptions = require('./modules/classes/DefaultOptions');
const confirmDb = require('./modules/submodules/confirmDb');

class SqliteExpress
{
    /**
     * This constructor creates an instance of sqlite-express
     * @param {string} rootPath - An absolute path to the root directory from which you want to work. by default it will be the directory from which you execute the command in the terminal.
     */
    constructor(rootPath=process.cwd())
    {
        this._dataBasesList = {};
        this._rootPath =  rootPath
        this._defaultOptions = new DefaultOptions(this._rootPath);
    }
    set rootPath(value)
    {
        [ this._rootPath, this._defaultOptions._rootPath, this._defaultOptions.root ] = Array(3).fill(value);
    }
    get rootPath(){ return this._rootPath };
    get dataBasesList(){ return Object.keys( this._dataBasesList ) };
    get defaultOptions(){ return this._defaultOptions };

    /**
     * This function creates a sqlite database
     * @param {object} params - An object with the parameters
     * @param {string} [params.route='the root path'] - A path relative to the root path
     * @param {string} [params.key='random hexadecimal string'] - The key name by which you will call the database
     * @param {boolean} [params.logQuery=true] - Do you want the action to be printed on the console?
     * @returns {string} The database key
    */
    createDB(params={})
    {
        console.log(this.defaultOptions.route)
        const
        {
            route=this.defaultOptions.route,
            key=this.defaultOptions.key,
            logQuery=this.defaultOptions.logQuery
        } = params;

        return newDB({ context : this, route, key, logQuery })
    };

    /**
     * @typedef {'text' | 'integer' | 'datetime'} ColumnType
     * @typedef {Object.<string, ColumnType>} ColumnParams

     * This function creates a table in a sqlite database.
     * @param {object} params - An object with the parameters
     * @param {string} params.db - The key of the sqlite database you want to use
     * @param {string} params.table - The name you want to give to the table
     * @param {ColumnParams} params.columns - An object with the keys as column names and whose value is a string of column type sqlite
     * @param {boolean} params.logQuery - Do you want the action to be printed on the console?
     * @returns {object} A promise that is resolved when the query was executed.
     */
    createTable(params={})
    {
        const
        {
            db=this.defaultOptions.db,
            table=this.defaultOptions.table,
            columns=this.defaultOptions.columns,
            logQuery=this.defaultOptions.logQuery
        } = params;

        confirmDb(db, this._dataBasesList);
        return new Promise((resolve, reject) =>
        {
            this._dataBasesList[db].addOperation
            ({  
                method : require('./modules/methods/table'),
                parameters : { table, columns, logQuery },
                resolve, reject
            })
        })
    };

    /**
     * This function inserts a row in the table of your choice.
     * @param {object} params - An object with the parameters
     * @param {string} params.db - The key of the sqlite database you want to use
     * @param {string} params.table - The name of the table into which you want to insert a row
     * @param {object} params.row - The row you want to insert with format { columnName : valueToInsert }
     * @param {boolean} params.logQuery - Do you want the action to be printed on the console?
     * @returns {object} A promise that resolves to a boolean when the query executes
    */
    insert(params={})
    {
        const
        {
            db=this.defaultOptions.db,
            table=this.defaultOptions.table,
            row=this.defaultOptions.row,
            logQuery=this.defaultOptions.logQuery
        } = params;

        confirmDb(db, this._dataBasesList);
        return new Promise((resolve, reject) =>
        {
            this._dataBasesList[db].addOperation
            ({
                method : require('./modules/methods/insert'),
                parameters : { table, row, logQuery },
                resolve, reject
            })
        })
    }

    /**
     * This function performs a sqlite select query to return data.
     * @param {object} params - An object with the parameters
     * @param {string} params.db - The key of the sqlite database you want to use
     * @param {string} params.table - The name of the table into which you want to select data
     * @param {string | object} params.select - The columns you want to select
     * @param {object} [params.where] - The where sqlite-express statement to filter the desired data
     * @param {'AND' | 'OR'} [params.connector='AND'] - A string with AND or OR connector
     * @param {object} [params.join] - A sqlite-express join statement
     * @param {boolean} [params.processColumns=true] - You want the columns to be processed
     * @param {boolean} [params.processRows=true] -You want the rows to be processed
     * @param {*} [params.emptyResult=undefined] -In value you want to get if no matches are found in the database
     * @param {boolean} params.logQuery - Do you want the action to be printed on the console?
     * @returns {object} A promise that resolves to the result of your query when the query executes
    */
    select(params={})
    {
        const
        {
            db=this.defaultOptions.db,
            table=this.defaultOptions.table,
            select=this.defaultOptions.select,
            where=this.defaultOptions.where,
            connector=this.defaultOptions.connector,
            join=this.defaultOptions.join,
            processColumns=this.defaultOptions.processColumns,
            processRows=this.defaultOptions.processRows,
            emptyResult=this.defaultOptions.emptyResult,
            logQuery=this.defaultOptions.logQuery
        } = params;

        confirmDb(db, this._dataBasesList);
        return new Promise((resolve, reject) =>
        {
            this._dataBasesList[db].addOperation
            ({
                method : require('./modules/methods/select'),
                parameters :
                {
                    table,
                    select,
                    where,
                    connector,
                    join,
                    processColumns,
                    processRows,
                    emptyResult,
                    logQuery
                },
                resolve, reject
            })
        })
    };

    /**
     * This function is used to update data in a sqlite database.
     * @param {object} params - An object with the parameters
     * @param {string} params.db - The key of the sqlite database you want to use
     * @param {string} params.table - The name of the table into which you want to update data
     * @param {object} params.update - An object with the columns you want to update in the format {columnName : newValue} or {columnName : (prevValue) =>{return newValue}}
     * @param {object} [params.where] - The where sqlite-express statement to filter the desired data
     * @param {'AND' | 'OR'} [params.connector='AND'] - A string with AND or OR connector
     * @param {boolean} params.logQuery - Do you want the action to be printed on the console?
     * @returns {object} A promise that results in a number with the number of rows affected
    */
    update(params={})
    {
        const
        {
            db=this.defaultOptions.db,
            table=this.defaultOptions.table,
            update=this.defaultOptions.update,
            where=this.defaultOptions.where,
            connector=this.defaultOptions.connector,
            logQuery=this.defaultOptions.logQuery
        } = params;

        confirmDb(db, this._dataBasesList);
        return new Promise((resolve, reject) =>
        {
            this._dataBasesList[db].addOperation
            ({
                method : require('./modules/methods/update'),
                parameters : { table, update, where, connector, logQuery },
                resolve, reject
            })
        })
    };

    /**
     * This function is used to delete data from a sqlite database
     * @param {object} params - An object with the parameters
     * @param {string} params.db - The key of the sqlite database you want to use
     * @param {string} params.table - The name of the table into which you want to update data
     * @param {object} [params.where] - The where sqlite-express statement to filter the desired data
     * @param {'AND' | 'OR'} [params.connector='AND'] - A string with AND or OR connector
     * @param {boolean} params.logQuery - Do you want the action to be printed on the console?
     * @returns {object} A promise that results in a number with the number of rows affected
    */
    delete(params={})
    {
        const
        {
            db=this.defaultOptions.db,
            table=this.defaultOptions.table,
            where=this.defaultOptions.where,
            connector=this.defaultOptions.connector,
            logQuery=this.defaultOptions.logQuery
        } = params;

        confirmDb(db, this._dataBasesList);
        return new Promise((resolve, reject) =>
        {
            this._dataBasesList[db].addOperation
            ({
                method : require('./modules/methods/delete'),
                parameters : { table, where, connector, logQuery },
                resolve, reject
            })
        })
    };

    /**
     * This function allows you to determine if an element with a certain condition exists in a sqlite database
     * @param {object} params - An object with the parameters
     * @param {string} params.db - The key of the sqlite database you want to use
     * @param {string} params.table - The name of the table into which you want to update data
     * @param {object} [params.where] - The where sqlite-express statement to filter the desired data
     * @param {'AND' | 'OR'} [params.connector='AND'] - A string with AND or OR connector
     * @param {boolean} params.logQuery - Do you want the action to be printed on the console?
     * @returns {object} A promise that resolves to a Boolean that indicates whether the element exists or not
    */
    exist(params={})
    {
        const
        {
            db=this.defaultOptions.db,
            table=this.defaultOptions.table,
            where=this.defaultOptions.where,
            connector=this.defaultOptions.connector,
            logQuery=this.defaultOptions.logQuery
        } = params;

        confirmDb(db, this._dataBasesList);
        return new Promise((resolve, reject) =>
        {
            this._dataBasesList[db].addOperation
            ({
                method : require('./modules/methods/exist'),
                parameters : { table, where, connector, logQuery },
                resolve, reject
            })
        })
    };

    /**
     * This function allows you to count rows that meet a certain condition in a SQLite database.
     * @param {object} params - An object with the parameters
     * @param {string} params.db - The key of the sqlite database you want to use
     * @param {string} params.table - The name of the table into which you want to update data
     * @param {object} [params.where] - The where sqlite-express statement to filter the desired data
     * @param {'AND' | 'OR'} [params.connector='AND'] - A string with AND or OR connector
     * @param {boolean} params.logQuery - Do you want the action to be printed on the console?
     * @returns {object} A promise that resolves to a number that indicates the number of rows that meet the condition
    */
    count(params={})
    {
        const
        {
            db=this.defaultOptions.db,
            table=this.defaultOptions.table,
            where=this.defaultOptions.where,
            connector=this.defaultOptions.connector,
            logQuery=this.defaultOptions.logQuery
        } = params;

        confirmDb(db, this._dataBasesList);
        return new Promise((resolve, reject) =>
        {
            this._dataBasesList[db].addOperation
            ({
                method : require('./modules/methods/count'),
                parameters : { table, where, connector, logQuery },
                resolve, reject
            })
        })
    };

    /**
     * This function is used to directly execute a sql query.
     * @param {object} params - An object with the parameters
     * @param {string} params.db - The key of the sqlite database you want to use
     * @param {string} params.query - The sql query you want to execute
     * @param {boolean} [params.processColumns=true] - You want the columns to be processed
     * @param {boolean} [params.processRows=true] -You want the rows to be processed
     * @param {boolean} params.logQuery - Do you want the action to be printed on the console?
     * @param {*} [params.emptyResult=undefined] -In value you want to get if no matches are found in the database
     * @returns {object} A promise that resolves to query result
    */
    executeSQL(params={})
    {
        const
        {
            db=this.defaultOptions.db,
            query=this.defaultOptions.query,
            logQuery=this.defaultOptions.logQuery,
            emptyResult=this.defaultOptions.emptyResult,
            processColumns=this.defaultOptions.processColumns,
            processRows=this.defaultOptions.processRows
        } = params;

        confirmDb(db, this._dataBasesList);
        return new Promise((resolve, reject) =>
        {
            this._dataBasesList[db].addOperation
            ({
                method : require('./modules/methods/executeSQL'),
                parameters : { query, logQuery, emptyResult, processColumns, processRows },
                resolve, reject
            })
        })
    }
};

module.exports = SqliteExpress;