import { OptionsType } from "../class-options/types";
import { DBType } from "../db/types";
import { Params } from "../../types/params";
import { Functions } from "../../types/functions";
import { OptionalArgs } from "../../types/args";


export interface SqliteExpressType<
    E extends Params["expected"] = Params["expected"],
    T extends Params["type"] = Params["type"]
>{
    _rootPath: string;
    defaultOptions: OptionsType;

    createDB(options?: OptionalArgs["createDb"]): DBType;
    createTable(options?: OptionalArgs["createTable"]): Returns["createTable"];
    select(options?: OptionalArgs<E>["select"]): Returns<E>["select"];
    insert(options?: OptionalArgs["insert"]): Returns["insert"];
    update(options?: OptionalArgs["update"]): Returns["update"];
    delete(options?: OptionalArgs["delete"]): Returns["delete"];
    exist(options?: OptionalArgs["exist"]): Returns["exist"];
    count(options?: OptionalArgs["count"]): Returns["count"];
    executeSQL(options?: OptionalArgs<E, T>["executeSQL"]): Returns<E, T>["executeSQL"];
    beginTransaction(options?: OptionalArgs["beginTransaction"]): Returns["beginTransaction"];
    rollback(options?: OptionalArgs["rollback"]): Returns["rollback"];
    commit(options?: OptionalArgs["commit"]): Returns["commit"];
    declareSQL(options?: OptionalArgs<E, T>["declareSQL"]): Returns<E, T>["declareSQL"];
}

export interface SqliteExpressClass
{
    new(rootPath?: string): SqliteExpressType;
}