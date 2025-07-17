import { OptionsType } from "../class-options/types";
import { DBType } from "../class-db/types";
import { Params } from "../types/params";
import { Functions } from "../types/functions";
import { OptionalArgs } from "../types/args";


export interface SqliteExpressType {
    _rootPath: string;
    defaultOptions: OptionsType;

    createDB(options?: OptionalArgs["createDb"]): DBType;
    createTable(options?: OptionalArgs["createTable"]): Returns["createTable"];
    select<E extends Params["expected"]>(options?: OptionalArgs<E>["select"]): Returns<E>["select"];
    insert(options?: OptionalArgs["insert"]): Returns["insert"];
    update(options?: OptionalArgs["update"]): Returns["update"];
    delete(options?: OptionalArgs["delete"]): Returns["delete"];
    exist(options?: OptionalArgs["exist"]): Returns["exist"];
    count(options?: OptionalArgs["count"]): Returns["count"];
    executeSQL<E extends Params["expected"], T extends Params["type"]>(options?: OptionalArgs<E, T>["executeSQL"]): Returns<E, T>["executeSQL"];
    beginTransaction(options?: OptionalArgs["beginTransaction"]): Returns["beginTransaction"];
    rollback(options?: OptionalArgs["rollback"]): Returns["rollback"];
    commit(options?: OptionalArgs["commit"]): Returns["commit"];
}

export interface SqliteExpressClass
{
    new(rootPath: string): SqliteExpressType;
}