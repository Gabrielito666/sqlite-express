import { Returns } from "lib/types/returns";
import { OptionsType } from "../class-options/types";
import { Params } from "../types/params";

export type ExecuteSQLFunction<
    E extends Params["expected"] = Params["expected"],
    T extends Params["type"] = Params["type"]
> = (options:OptionsType<E, T>) => Returns<E, T>["executeSQL"];