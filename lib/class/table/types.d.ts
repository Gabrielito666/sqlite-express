import { TableName } from "lib/types";
import { DB } from "lib/class/db/types";

export interface Table
{
    tableName: TableName;
    db: DB;
    select:
    {
        (args: Omit<Parameters<DB["select"]>[0], "table">): ReturnType<DB["select"]>;
        rows(args: Omit<Parameters<DB["select"]["rows"]>[0], "table">): ReturnType<DB["select"]["rows"]>;
        row(args: Omit<Parameters<DB["select"]["row"]>[0], "table">): ReturnType<DB["select"]["row"]>;
        celd(args: Omit<Parameters<DB["select"]["celd"]>[0], "table">): ReturnType<DB["select"]["celd"]>;
        column(args: Omit<Parameters<DB["select"]["column"]>[0], "table">): ReturnType<DB["select"]["column"]>;
    }
    insert(args: Omit<Parameters<DB["insert"]>[0], "table">): ReturnType<DB["insert"]>;
    update(args: Omit<Parameters<DB["update"]>[0], "table">): ReturnType<DB["update"]>;
    delete(args: Omit<Parameters<DB["delete"]>[0], "table">): ReturnType<DB["delete"]>;
    exist(args: Omit<Parameters<DB["exist"]>[0], "table">): ReturnType<DB["exist"]>;
    count(args: Omit<Parameters<DB["count"]>[0], "table">): ReturnType<DB["count"]>;
}

export interface TableClass
{
    new(tableName: TableName, db: DB): Table;
}