import { Database } from "sqlite3";
import { Connector, Where } from "../types/index";
import { ExpectedResult } from "../types/index";
import { ExpectedParam, TypeParam } from "../class-options/types";
import { OptionsType } from "../class-options/types";

export type SelectParam = string|string[]|{[key:string]: { as:string }};

export type SelectFunction =
<E extends ExpectedParam>(options:OptionsType<E, TypeParam>)
=> Promise<ExpectedResult<E>>;