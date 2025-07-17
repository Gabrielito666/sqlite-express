import { StrictArgs } from "../types/args";
import { OptionsType } from "../class-options/types";

type OpDefault = OptionsType<Params["expected"], Params["type"]>;

export interface ParametersEval
{
    createDb: (options: OpDefault) => StrictArgs["createDb"];
    select: (options: OpDefault) => StrictArgs["select"];
    insert: (options: OpDefault) => StrictArgs["insert"];
    update: (options: OpDefault) => StrictArgs["update"];
    delete: (options: OpDefault) => StrictArgs["delete"];
    exist: (options: OpDefault) => StrictArgs["exist"];
    count: (options: OpDefault) => StrictArgs["count"];
    executeSQL: (options: OpDefault) => StrictArgs["executeSQL"];
    createTable: (options: OpDefault) => StrictArgs["createTable"];
    beginTransaction: (options: OpDefault) => StrictArgs["beginTransaction"];
    rollback: (options: OpDefault) => StrictArgs["rollback"];
    commit: (options: OpDefault) => StrictArgs["commit"];
}