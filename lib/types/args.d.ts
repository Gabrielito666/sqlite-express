import { Params } from "./params";

export interface StrictArgs<
E extends Params["expected"] = Params["expected"],
T extends Params["type"] = Params["type"]
>
{
    select:
    {
        db: Params["db"];
        table: Params["table"];
        select: Params["select"];
        where: Params["where"];
        connector: Params["connector"];
        logQuery: Params["logQuery"];
        expected: E;
    };
    insert:
    {
        db: Params["db"];
        table: Params["table"];
        row: Params["row"];
        logQuery: Params["logQuery"];
    };
    update:
    {
        db: Params["db"];
        table: Params["table"];
        update: Params["update"];
        where: Params["where"];
        connector: Params["connector"];
        logQuery: Params["logQuery"];
    };
    delete:
    {
        db: Params["db"];
        table: Params["table"];
        where: Params["where"];
        connector: Params["connector"];
        logQuery: Params["logQuery"];
    };
    exist:
    {
        db: Params["db"];
        table: Params["table"];
        where: Params["where"];
        connector: Params["connector"];
        logQuery: Params["logQuery"];
    };
    count:
    {
        db: Params["db"];
        table: Params["table"];
        where: Params["where"];
        connector: Params["connector"];
        logQuery: Params["logQuery"];
    };
    executeSQL:
    {
        db: Params["db"];   
        query: Params["query"];
        parameters: Params["parameters"];
        logQuery: Params["logQuery"];
        expected: E;
        type: T;
    };
    createTable:
    {
        db: Params["db"];
        table: Params["table"];
        columns: Params["columns"];
        logQuery: Params["logQuery"];
    };
    createDB:
    {
        route: Params["route"];
        logQuery: Params["logQuery"];
    };
    beginTransaction:
    {
        db: Params["db"];
        logQuery: Params["logQuery"];
    };
    rollback:
    {
        db: Params["db"];
        logQuery: Params["logQuery"];
    };
    commit:
    {
        db: Params["db"];
        logQuery: Params["logQuery"];
    };
}

export interface OptionalArgs<
E extends Params["expected"] = Params["expected"],
T extends Params["type"] = Params["type"]
>
{
    select: Partial<StrictArgs<E>["select"]>;
    insert: Partial<StrictArgs["insert"]>;
    update: Partial<StrictArgs["update"]>;
    delete: Partial<StrictArgs["delete"]>;
    exist: Partial<StrictArgs["exist"]>;
    count: Partial<StrictArgs["count"]>;
    executeSQL: Partial<StrictArgs<E, T>["executeSQL"]>;
    createTable: Partial<StrictArgs["createTable"]>;
    createDB: Partial<StrictArgs["createDb"]>;
    beginTransaction: Partial<StrictArgs["beginTransaction"]>;
    rollback: Partial<StrictArgs["rollback"]>;
    commit: Partial<StrictArgs["commit"]>;
}