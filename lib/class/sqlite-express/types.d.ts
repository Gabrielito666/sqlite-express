import { DB, DBClass } from "../db/types";
import { RouteArg, LogQueryArg, DBArg } from "../../types/index";

export interface SqliteExpress
{
    logQuery: boolean;
    createDB(args: RouteArg & LogQueryArg): DB;
    createTable(args: Parameters<DB["createTable"]>[0] & DBArg): ReturnType<DB["createTable"]>;
    select:
    {
        (args: Parameters<DB["select"]>[0] & DBArg): ReturnType<DB["select"]>;
        rows(args: Parameters<DB["select"]["rows"]>[0] & DBArg): ReturnType<DB["select"]["rows"]>;
        row(args: Parameters<DB["select"]["row"]>[0] & DBArg): ReturnType<DB["select"]["row"]>;
        celd(args: Parameters<DB["select"]["celd"]>[0] & DBArg): ReturnType<DB["select"]["celd"]>;
        column(args: Parameters<DB["select"]["column"]>[0] & DBArg): ReturnType<DB["select"]["column"]>;
    }
    insert(args: Parameters<DB["insert"]>[0] & DBArg): ReturnType<DB["insert"]>; 
    update(args: Parameters<DB["update"]>[0] & DBArg): ReturnType<DB["update"]>;
    delete(args: Parameters<DB["delete"]>[0] & DBArg): ReturnType<DB["delete"]>; 
    exist(args: Parameters<DB["exist"]>[0] & DBArg): ReturnType<DB["exist"]>;
    count(args: Parameters<DB["count"]>[0] & DBArg): ReturnType<DB["count"]>;
    executeSQL:
    {
        (args: Parameters<DB["executeSQL"]>[0] & DBArg): ReturnType<DB["executeSQL"]>;
        select:
        {
            (args: Parameters<DB["executeSQL"]["select"]>[0] & DBArg): ReturnType<DB["executeSQL"]["select"]>;
            rows(args: Parameters<DB["executeSQL"]["select"]["rows"]>[0] & DBArg): ReturnType<DB["executeSQL"]["select"]["rows"]>;
            row(args: Parameters<DB["executeSQL"]["select"]["row"]>[0] & DBArg): ReturnType<DB["executeSQL"]["select"]["row"]>;
            celd(args: Parameters<DB["executeSQL"]["select"]["celd"]>[0] & DBArg): ReturnType<DB["executeSQL"]["select"]["celd"]>;
            column(args: Parameters<DB["executeSQL"]["select"]["column"]>[0] & DBArg): ReturnType<DB["executeSQL"]["select"]["column"]>;
        };
        insert(args: Parameters<DB["executeSQL"]["insert"]>[0] & DBArg): ReturnType<DB["executeSQL"]["insert"]>;
        update(args: Parameters<DB["executeSQL"]["update"]>[0] & DBArg): ReturnType<DB["executeSQL"]["update"]>;
        delete(args: Parameters<DB["executeSQL"]["delete"]>[0] & DBArg): ReturnType<DB["executeSQL"]["delete"]>;
        justRun(args: Parameters<DB["executeSQL"]["justRun"]>[0] & DBArg): ReturnType<DB["executeSQL"]["justRun"]>;
    }
    begin:
    {
        (args: Parameters<DB["begin"]>[0] & DBArg): ReturnType<DB["begin"]>;
        transaction(args: Parameters<DB["begin"]["transaction"]>[0] & DBArg): ReturnType<DB["begin"]["transaction"]>;
        deferredTransaction(args: Parameters<DB["begin"]["deferredTransaction"]>[0] & DBArg): ReturnType<DB["begin"]["deferredTransaction"]>;
        immediateTransaction(args: Parameters<DB["begin"]["immediateTransaction"]>[0] & DBArg): ReturnType<DB["begin"]["immediateTransaction"]>;
        exclusiveTransaction(args: Parameters<DB["begin"]["exclusiveTransaction"]>[0] & DBArg): ReturnType<DB["begin"]["exclusiveTransaction"]>;
    }
    rollback(args: Parameters<DB["rollback"]>[0] & DBArg): ReturnType<DB["rollback"]>;
    commit(args: Parameters<DB["commit"]>[0] & DBArg): ReturnType<DB["commit"]>;
    declareSQL(args: Parameters<DB["declareSQL"]>[0] & DBArg): ReturnType<DB["declareSQL"]>;
}

export interface SqliteExpressClass
{
    DB:DBClass;
    new(args?: LogQueryArg): SqliteExpress;
}
