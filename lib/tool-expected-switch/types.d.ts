import { StrictArgs } from "../types/args";
import { Params } from "../types/params";
import { Returns } from "lib/types/returns";

export type ExpectedSwitchFunction = <
    E extends Params["expected"]
>
(params: {
    db: Params["db"];
    query: Params["query"];
    parameters: Params["parameters"];
    expected:E;
    logQuery:Params["logQuery"];
}) => Returns<E>["select"];