/**@typedef {import("./types").ParametersEvalSelectFunction} ParametersEvalSelectFunction*/
/**@typedef {import("./types").ParametersEvalInsertFunction} ParametersEvalInsertFunction*/
/**@typedef {import("./types").ParametersEvalUpdateFunction} ParametersEvalUpdateFunction*/
/**@typedef {import("./types").ParametersEvalDeleteFunction} ParametersEvalDeleteFunction*/
/**@typedef {import("./types").ParametersEvalExistFunction} ParametersEvalExistFunction*/
/**@typedef {import("./types").ParametersEvalCountFunction} ParametersEvalCountFunction*/
/**@typedef {import("./types").ParametersEvalExecuteSQLFunction} ParametersEvalExecuteSQLFunction*/
/**@typedef {import("./types").ParametersEvalCreateTableFunction} ParametersEvalCreateTableFunction*/

/**@type {ParametersEvalSelectFunction}*/
const parametersEvalSelect = (options) =>
{
    
    const {db, table, select, where, connector, logQuery, expected} = options;

    if(!db) throw new Error("The database is not defined");
    if(!table) throw new Error("The table is not defined");
    if(!select) throw new Error("The select is not defined");
    if(!logQuery) throw new Error("The logQuery is not defined");
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

/**@type {ParametersEvalInsertFunction}*/
const parametersEvalInsert = (options) =>
{
    const {db, table, row, logQuery} = options;

    if(!db) throw new Error("The database is not defined");
    if(!table) throw new Error("The table is not defined");
    if(!row) throw new Error("The row is not defined");
    if(!logQuery) throw new Error("The logQuery is not defined");

    return {
        db,
        table,
        row,
        logQuery,
    }
}

/**@type {ParametersEvalUpdateFunction}*/
const parametersEvalUpdate = (options) =>
{
    const {db, table, update, where, connector, logQuery} = options;

    if(!db) throw new Error("The database is not defined");
    if(!table) throw new Error("The table is not defined");
    if(!update) throw new Error("The update is not defined");
    if(!logQuery) throw new Error("The logQuery is not defined");

    return {
        db,
        table,
        update,
        where,
        connector,
        logQuery,
    }
}

/**@type {ParametersEvalDeleteFunction}*/
const parametersEvalDelete = (options) =>
{
    const {db, table, where, connector, logQuery} = options;

    if(!db) throw new Error("The database is not defined");
    if(!table) throw new Error("The table is not defined");
    if(!logQuery) throw new Error("The logQuery is not defined");

    return {
        db,
        table,
        where,
        connector,
        logQuery,
    }
}

/**@type {ParametersEvalExistFunction}*/
const parametersEvalExist = (options) =>
{
    const {db, table, where, connector, logQuery} = options;

    if(!db) throw new Error("The database is not defined");
    if(!table) throw new Error("The table is not defined");
    if(!logQuery) throw new Error("The logQuery is not defined");

    return {
        db,
        table,
        where,
        connector,
        logQuery,
    }
}

/**@type {ParametersEvalCountFunction}*/
const parametersEvalCount = (options) =>
{
    const {db, table, where, connector, logQuery} = options;

    if(!db) throw new Error("The database is not defined");
    if(!table) throw new Error("The table is not defined");
    if(!logQuery) throw new Error("The logQuery is not defined");

    return {
        db,
        table,
        where,
        connector,
        logQuery,
    }
}

/**@type {ParametersEvalExecuteSQLFunction}*/
const parametersEvalExecuteSQL = (options) =>
{
    const {db, query, parameters, logQuery, expected, type} = options;

    if(!db) throw new Error("The database is not defined");
    if(!query) throw new Error("The query is not defined");
    if(!logQuery) throw new Error("The logQuery is not defined");

    return {
        db,
        query,
        parameters,
        logQuery,
        expected,
        type,
    }
}

/**@type {ParametersEvalCreateTableFunction}*/
const parametersEvalCreateTable = (options) =>
{
    const {db, table, columns, logQuery} = options;

    if(!db) throw new Error("The database is not defined");
    if(!table) throw new Error("The table is not defined");
    if(!columns) throw new Error("The columns is not defined");
    if(!logQuery) throw new Error("The logQuery is not defined");

    return {
        db,
        table,
        columns,
        logQuery,
    }
}

module.exports = {
    parametersEvalSelect,
    parametersEvalInsert,
    parametersEvalUpdate,
    parametersEvalDelete,
    parametersEvalExist,
    parametersEvalCount,
    parametersEvalExecuteSQL,
    parametersEvalCreateTable
};