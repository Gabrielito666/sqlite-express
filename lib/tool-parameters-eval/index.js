/**@typedef {import("./types").ParametersEval} ParametersEval*/

/**@type {ParametersEval["createDb"]}*/
const parametersEvalCreateDb = (options) =>
{
    const { route, logQuery} = options;

    if(!route) throw new Error("The route is not defined");

    return {
        route,
        logQuery,
    };
}

/**@type {ParametersEval["select"]}*/
const parametersEvalSelect = (options) =>
{
    
    const {db, table, select, where, connector, logQuery, expected} = options;

    if(!db) throw new Error("The database is not defined");
    if(!table) throw new Error("The table is not defined");
    if(!select) throw new Error("The select is not defined");
    if(!expected) throw new Error("The expected is not defined");

    return {
        db,
        table,
        select,
        where,
        connector,
        logQuery,
        expected,
    }
}

/**@type {ParametersEval["insert"]}*/
const parametersEvalInsert = (options) =>
{
    const {db, table, row, logQuery} = options;

    if(!db) throw new Error("The database is not defined");
    if(!table) throw new Error("The table is not defined");
    if(!row) throw new Error("The row is not defined");
    

    return {
        db,
        table,
        row,
        logQuery,
    }
}

/**@type {ParametersEval["update"]}*/
const parametersEvalUpdate = (options) =>
{
    const {db, table, update, where, connector, logQuery} = options;

    if(!db) throw new Error("The database is not defined");
    if(!table) throw new Error("The table is not defined");
    if(!update) throw new Error("The update is not defined");


    return {
        db,
        table,
        update,
        where,
        connector,
        logQuery,
    }
}

/**@type {ParametersEval["delete"]}*/
const parametersEvalDelete = (options) =>
{
    const {db, table, where, connector, logQuery} = options;

    if(!db) throw new Error("The database is not defined");
    if(!table) throw new Error("The table is not defined");


    return {
        db,
        table,
        where,
        connector,
        logQuery,
    }
}

/**@type {ParametersEval["exist"]}*/
const parametersEvalExist = (options) =>
{
    const {db, table, where, connector, logQuery} = options;

    if(!db) throw new Error("The database is not defined");
    if(!table) throw new Error("The table is not defined");

    return {
        db,
        table,
        where,
        connector,
        logQuery,
    }
}

/**@type {ParametersEval["count"]}*/
const parametersEvalCount = (options) =>
{
    const {db, table, where, connector, logQuery} = options;

    if(!db) throw new Error("The database is not defined");
    if(!table) throw new Error("The table is not defined");


    return {
        db,
        table,
        where,
        connector,
        logQuery,
    }
}

/**@type {ParametersEval["executeSQL"]}*/
const parametersEvalExecuteSQL = (options) =>
{
    const {db, query, parameters, logQuery, expected, type} = options;

    if(!db) throw new Error("The database is not defined");
    if(!query) throw new Error("The query is not defined");


    return {
        db,
        query,
        parameters,
        logQuery,
        expected,
        type,
    }
}

/**@type {ParametersEval["createTable"]}*/
const parametersEvalCreateTable = (options) =>
{
    const {db, table, columns, logQuery} = options;

    if(!db) throw new Error("The database is not defined");
    if(!table) throw new Error("The table is not defined");
    if(!columns) throw new Error("The columns is not defined");


    return {
        db,
        table,
        columns,
        logQuery,
    }
}

/**@type {ParametersEval["beginTransaction"]}*/
const parametersEvalBeginTransaction = (options) =>
{
    const {db, logQuery} = options;

    if(!db) throw new Error("The database is not defined");

    return {
        db,
        logQuery,
    }
}


/**@type {ParametersEval["rollback"]}*/
const parametersEvalRollback = parametersEvalBeginTransaction; //Porque es igual
/**@type {ParametersEval["commit"]}*/
const parametersEvalCommit = parametersEvalBeginTransaction;

module.exports = {
    parametersEvalCreateDb,
    parametersEvalSelect,
    parametersEvalInsert,
    parametersEvalUpdate,
    parametersEvalDelete,
    parametersEvalExist,
    parametersEvalCount,
    parametersEvalExecuteSQL,
    parametersEvalCreateTable,
    parametersEvalBeginTransaction,
    parametersEvalRollback,
    parametersEvalCommit,
};