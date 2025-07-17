import { Params } from "./params";
import { OptionsType } from "../class-options/types";
import { Returns } from "./returns";

export interface Functions<
    E extends Params["expected"] = Params["expected"],
    T extends Params["type"] = Params["type"]
>
{
    createTable: (options: OptionsType)=> Returns["createTable"];
    createDB: (options: OptionsType)=> Returns["createDB"];
    select: (options: OptionsType<E>)=> Returns<E>["select"];
    insert: (options: OptionsType)=> Returns["insert"];
    update: (options: OptionsType)=> Returns["update"];
    delete: (options: OptionsType)=> Returns["delete"];
    exist: (options: OptionsType)=> Returns["exist"];
    count: (options: OptionsType)=> Returns["count"];
    executeSQL: (options: OptionsType<E, T>)=> Returns<E, T>["executeSQL"];
}