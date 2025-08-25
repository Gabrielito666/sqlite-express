import { OptionalArgs } from "../../types/args";
import { Params } from "../../types/params";
import { Database, Statement } from "sqlite3";
import { WaitingListType } from "../class-operations-list/types";
import { OptionsType } from "../class-options/types";
import { SqliteExpressType } from "../types/sqlite-express";
import { Returns } from "lib/types/returns";
import { TransactionType } from "lib/class-transaction/types";
import { TransactionsListType } from "lib/class/class-transactions-list/types";
import { ColumnsArg, ConnectorArg, LogQueryArg, ParametersArg, QueryArg, RowArg, ScopeArg, SelectArg, TableArg, TableNameArg, WhereArg } from "lib/types";
import { CreateTableFunction } from "lib/functions/create-table";
import { SelectFunction } from "lib/functions/select";
import { ExecuteSQLFunction } from "lib/functions/execute-sql";
import { DeclareSQLFunction } from "lib/functions/declare-sql";
import { BeginFunction } from "lib/functions/begin";
import { RollbackFunction } from "lib/functions/rollback";
import { CommitFunction } from "lib/functions/commit";
import { CountFunction } from "lib/functions/count";
import { DeleteFunction } from "lib/functions/delete";
import { ExistFunction } from "lib/functions/exist";
import { UpdateFunction } from "lib/functions/update";
import { InsertFunction } from "lib/functions/insert";
import { ScopesQueue } from "lib/class/scopes-queue";
import { Table } from "lib/class/table";

export interface DB
{
    logQuery: boolean;
    createScope():Scope;
    addBeforeFunction(func:(() => Promise<any>)|Promise<any>):Promise<any>;
    getTable(tableName:string):Table;
    select:
    {
        (args: TableArg & SelectArg & WhereArg & ConnectorArg & LogQueryArg & ScopeArg):ReturnType<SelectFunction>;
        rows(args: TableArg & SelectArg & WhereArg & ConnectorArg & LogQueryArg & ScopeArg):ReturnType<SelectFunction["rows"]>;
        row(args: TableArg & SelectArg & WhereArg & ConnectorArg & LogQueryArg & ScopeArg):ReturnType<SelectFunction["row"]>;
        column(args: TableArg & SelectArg & WhereArg & ConnectorArg & LogQueryArg & ScopeArg):ReturnType<SelectFunction["column"]>;
        celd(args: TableArg & SelectArg & WhereArg & ConnectorArg & LogQueryArg & ScopeArg):ReturnType<SelectFunction["celd"]>;
    }
    createTable(args: TableNameArg & ColumnsArg & LogQueryArg & ScopeArg):ReturnType<CreateTableFunction>;
    insert(args: TableArg & RowArg & LogQueryArg & ScopeArg):ReturnType<InsertFunction>;
    update(args: TableArg & UpdateArg & WhereArg & ConnectorArg & LogQueryArg & ScopeArg):ReturnType<UpdateFunction>;
    delete(args: TableArg & WhereArg & ConnectorArg & LogQueryArg & ScopeArg):ReturnType<DeleteFunction>;
    exist(args: TableArg & WhereArg & ConnectorArg & LogQueryArg & ScopeArg):ReturnType<ExistFunction>;
    count(args: TableArg & WhereArg & ConnectorArg & LogQueryArg & ScopeArg):ReturnType<CountFunction>;
    executeSQL:
    {
        (args: QueryArg & ParametersArg & LogQueryArg & ScopeArg):ReturnType<ExecuteSQLFunction>;
        select:
        {
            (args: QueryArg & ParametersArg & LogQueryArg & ScopeArg):ReturnType<ExecuteSQLFunction["select"]>;
            rows(args: QueryArg & ParametersArg & LogQueryArg & ScopeArg):ReturnType<ExecuteSQLFunction["select"]["rows"]>;
            row(args: QueryArg & ParametersArg & LogQueryArg & ScopeArg):ReturnType<ExecuteSQLFunction["select"]["row"]>;
            column(args: QueryArg & ParametersArg & LogQueryArg & ScopeArg):ReturnType<ExecuteSQLFunction["select"]["column"]>;
            celd(args: QueryArg & ParametersArg & LogQueryArg & ScopeArg):ReturnType<ExecuteSQLFunction["select"]["celd"]>;
        }
        insert(args: QueryArg & ParametersArg & LogQueryArg & ScopeArg):ReturnType<ExecuteSQLFunction["insert"]>;
        update(args: QueryArg & ParametersArg & LogQueryArg & ScopeArg):ReturnType<ExecuteSQLFunction["update"]>;
        delete(args: QueryArg & ParametersArg & LogQueryArg & ScopeArg):ReturnType<ExecuteSQLFunction["delete"]>;
        justRun(args: QueryArg & ParametersArg & LogQueryArg & ScopeArg):ReturnType<ExecuteSQLFunction["justRun"]>;
    };
    declareSQL(args: QueryArg & LogQueryArg & ScopeArg):ReturnType<DeclareSQLFunction>;
    begin:
    {
        (args: LogQueryArg & ScopeArg):ReturnType<BeginFunction>;
        transaction(args: LogQueryArg & ScopeArg):ReturnType<BeginFunction["transaction"]>;
        deferredTransaction(args: LogQueryArg & ScopeArg):ReturnType<BeginFunction["deferredTransaction"]>;
        immediateTransaction(args: LogQueryArg & ScopeArg):ReturnType<BeginFunction["immediateTransaction"]>;
        exclusiveTransaction(args: LogQueryArg & ScopeArg):ReturnType<BeginFunction["exclusiveTransaction"]>;
    }
    rollback(args: LogQueryArg & ScopeArg):ReturnType<RollbackFunction>;
    commit(args: LogQueryArg & ScopeArg):ReturnType<CommitFunction>;
    close():Promise<void>;
}

export interface DBPrivate
{
    sqliteDb:Database;
    scopesQueue:ScopesQueue;
    beginDefferredTransactionStamentPromise:Promise<Statement>,
    beginImmediateTransactionStamentPromise:Promise<Statement>,
    beginExclusiveTransactionStamentPromise:Promise<Statement>,
    rollbackStamentPromise:Promise<Statement>,
    commitStamentPromise:Promise<Statement>,
    awaitersList:Promise<void>[],
    tablesMap:Map<string, Table>,
}

export interface DBClass
{
    new(args: RouteArg & LogQueryArg):DB;
    private:WeakMap<DB, DBPrivate>;
    getPrivate(db:DB):DBPrivate;
    setPrivate(db:DB, pc:DBPrivate):void;
    awaitBeforeFunctions(db:DB):Promise<DB>;
    awaitBeforeFunctionsAndScopeStart(db:DB, scope:Scope):Promise<[DB, Scope]>;
};

export const DB: DBClass;