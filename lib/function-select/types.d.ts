import { Returns } from "lib/types/returns";
import { OptionsType } from "../class-options/types";
import { Params } from "../types/params";

export type SelectParam = string|string[]|{[key:string]: { as:string }};

export type SelectFunction = <E extends Params["expected"] = Params["expected"]>
(options:OptionsType<E>) => Returns<E>["select"];