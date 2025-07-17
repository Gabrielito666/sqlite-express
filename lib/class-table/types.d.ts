import { Params } from "../types/params";
import { OptionsType } from "../class-options/types";
import { Returns } from "../types/returns";
import { OptionalArgs } from "lib/types/args";

export interface TableType
{
    options: OptionsType;

    select(args?: Omit<OptionalArgs["select"], "db"|"table">): Returns["select"];
    insert(args?: Omit<OptionalArgs["insert"], "db"|"table">): Returns["insert"];
    update(args?: Omit<OptionalArgs["update"], "db"|"table">): Returns["update"];
    delete(args?: Omit<OptionalArgs["delete"], "db"|"table">): Returns["delete"];
    exist(args?: Omit<OptionalArgs["exist"], "db"|"table">): Returns["exist"];
    count(args?: Omit<OptionalArgs["count"], "db"|"table">): Returns["count"];
}

export interface TableClass
{
    new(name: Params["table"], db: Params["db"]): TableType;
}