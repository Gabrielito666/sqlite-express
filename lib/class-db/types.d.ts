import { OptionalArgs } from "../types/args";
import { Params } from "../types/params";
import { Database } from "sqlite3";
import { WaitingListType } from "../class-operations-list/types";
import { OptionsType } from "../class-options/types";
import { SqliteExpressType } from "../types/sqlite-express";
import { Returns } from "lib/types/returns";
import { TransactionType } from "lib/class-transaction/types";
import { TransactionsListType } from "lib/class-transactions-list/types";

export interface DBType<
    E extends Params["expected"] = Params["expected"],
    T extends Params["type"] = Params["type"]
>
{
    sqliteDb:Database;
    transactionsList:TransactionsListType;
    defaultOptions:OptionsType;

    createTransaction():TransactionType<E, T>;
    createTable(args?:Omit<OptionalArgs["createTable"], "db">):Returns["createTable"];
    select(args?:Omit<OptionalArgs<E>["select"], "db">):Retunrs<E>["select"];
    insert(args?:Omit<OptionalArgs["insert"], "db">):Returns["insert"];
    update(args?:Omit<OptionalArgs["update"], "db">):Returns["update"];
    delete(args?:Omit<OptionalArgs["delete"], "db">):Returns["delete"];
    exist(args?:Omit<OptionalArgs["exist"], "db">):Returns["exist"];
    count(args?:Omit<OptionalArgs["count"], "db">):Returns["count"];
    executeSQL(args?:Omit<OptionalArgs<E, T>["executeSQL"], "db">):Returns<E, T>["executeSQL"];
    beginTransaction(args?:Omit<OptionalArgs["beginTransaction"], "db">):Returns["beginTransaction"];
    rollback(args?:Omit<OptionalArgs["rollback"], "db">):Returns["rollback"];
    commit(args?:Omit<OptionalArgs["commit"], "db">):Returns["commit"];
    declareSQL(args?:Omit<OptionalArgs<E, T>["declareSQL"], "db">):Returns<E, T>["declareSQL"];
}

export interface DBClass
{
    new(context:SqliteExpressType, options:OptionsType):DBType;
};