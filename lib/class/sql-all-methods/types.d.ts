import { SqlTableMethods } from "../class-sql-table-methods/types";

export interface SqlAllMethods extends SqlTableMethods
{
    createTable(args:StrictArgs["createTable"]):Returns["createTable"];
    executeSQL(args:StrictArgs["executeSQL"]):Returns["executeSQL"];
    declareSQL(args:StrictArgs["declareSQL"]):Returns["declareSQL"];
    beginTransaction(args:StrictArgs["beginTransaction"]):Returns["beginTransaction"];
    rollback(args:StrictArgs["rollback"]):Returns["rollback"];
    commit(args:StrictArgs["commit"]):Returns["commit"];
}