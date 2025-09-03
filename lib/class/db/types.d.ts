import {
    ColumnsArg, ConnectorArg, LogQueryArg, ParametersArg, QueryArg, RowArg, ScopeArg,
    SelectArg, TableArg, TableNameArg, WhereArg, RouteArg, UpdateArg,

    BeginFunction, CommitFunction, CountFunction, CreateTableFunction, DeclareSQLFunction,
    DeleteFunction, ExecuteSQLFunction, ExistFunction, InsertFunction, RollbackFunction,
    SelectFunction, UpdateFunction,

    Table,
} from "../../types";
import { ScopesQueue, Scope } from "../scopes-queue/types";
import { Database } from "sqlite3";
export interface DB
{
    logQuery: boolean;
    createScope():Scope;
    getTable(tableName:string):Table;
    get select():
    ({
        (args: TableArg & SelectArg & WhereArg & LogQueryArg & ScopeArg):ReturnType<SelectFunction>;
        rows(args: TableArg & SelectArg & WhereArg & LogQueryArg & ScopeArg):ReturnType<SelectFunction["rows"]>;
        row(args: TableArg & SelectArg & WhereArg & LogQueryArg & ScopeArg):ReturnType<SelectFunction["row"]>;
        column(args: TableArg & SelectArg & WhereArg & LogQueryArg & ScopeArg):ReturnType<SelectFunction["column"]>;
        celd(args: TableArg & SelectArg & WhereArg & LogQueryArg & ScopeArg):ReturnType<SelectFunction["celd"]>;
    });
    createTable(args: TableNameArg & ColumnsArg & LogQueryArg & ScopeArg):ReturnType<CreateTableFunction>;
    insert(args: TableArg & RowArg & LogQueryArg & ScopeArg):ReturnType<InsertFunction>;
    update(args: TableArg & UpdateArg & WhereArg & LogQueryArg & ScopeArg):ReturnType<UpdateFunction>;
    delete(args: TableArg & WhereArg & LogQueryArg & ScopeArg):ReturnType<DeleteFunction>;
    exist(args: TableArg & WhereArg & LogQueryArg & ScopeArg):ReturnType<ExistFunction>;
    count(args: TableArg & WhereArg & LogQueryArg & ScopeArg):ReturnType<CountFunction>;
    get executeSQL():
    ({
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
    });
    declareSQL(args: QueryArg & LogQueryArg & ScopeArg):ReturnType<DeclareSQLFunction>;
    get begin():
    ({
        (args: LogQueryArg & ScopeArg):ReturnType<BeginFunction>;
        transaction(args: LogQueryArg & ScopeArg):ReturnType<BeginFunction["transaction"]>;
        deferredTransaction(args: LogQueryArg & ScopeArg):ReturnType<BeginFunction["deferredTransaction"]>;
        immediateTransaction(args: LogQueryArg & ScopeArg):ReturnType<BeginFunction["immediateTransaction"]>;
        exclusiveTransaction(args: LogQueryArg & ScopeArg):ReturnType<BeginFunction["exclusiveTransaction"]>;
    });
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
    tablesMap:Map<string, Table>,
}

export interface DBClass
{
    new(args: RouteArg & LogQueryArg):DB;
    private:WeakMap<DB, DBPrivate>;
    getPrivate(db:DB):DBPrivate;
    setPrivate(db:DB, pc:DBPrivate):void;
};

type SelectLikes = SelectFunction|SelectFunction["rows"]|SelectFunction["row"]|SelectFunction["column"]|SelectFunction["celd"];
type ExecSqlLikes = ExecuteSQLFunction|ExecuteSQLFunction["delete"]|ExecuteSQLFunction["insert"]|ExecuteSQLFunction["justRun"]|ExecuteSQLFunction["update"]|ExecuteSQLFunction["select"]|ExecuteSQLFunction["select"]["rows"]|ExecuteSQLFunction["select"]["row"]|ExecuteSQLFunction["select"]["column"]|ExecuteSQLFunction["select"]["celd"];


export type SimpleMethodWrap = <M extends Function>(method:M) => (
    args:(
        M extends SelectLikes ? Parameters<DB["select"]>[0] :
        M extends ExecSqlLikes ? Parameters<DB["executeSQL"]>[0] :
        M extends UpdateFunction ? Parameters<DB["update"]>[0] :
        M extends InsertFunction ?  Parameters<DB["insert"]>[0] :
        M extends DeclareSQLFunction ?  Parameters<DB["declareSQL"]>[0] :
        M extends DeleteFunction ?  Parameters<DB["delete"]>[0] :
        M extends ExistFunction ?  Parameters<DB["exist"]>[0] :
        M extends CountFunction ?  Parameters<DB["count"]>[0] :
        M extends CreateTableFunction ? Parameters<DB["createTable"]>[0] :
        never
    )
) => Promise<Awaited<ReturnType<M>>>;

type ArgsBegin = Parameters<DB["begin"]>[0];
type StmtKeys = "beginDefferredTransactionStamentPromise"|"beginImmediateTransactionStamentPromise"|"beginExclusiveTransactionStamentPromise"|"rollbackStamentPromise"|"commitStamentPromise";
export type StmtMethodWrap = <M extends Function>(method:M, stmtKey:StmtKeys) =>(args:ArgsBegin)=> Promise<Awaited<ReturnType<M>>>;