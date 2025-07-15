import { Database } from "sqlite3";
import { Where, Connector } from "../types";

export type DeleteFunction = (options:OptionsType<ExpectedParam, TypeParam>)
=> Promise<number>;
