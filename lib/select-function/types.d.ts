import { Database } from "sqlite3";
import { Connector, Where } from "../types/index";
import { ExpectedResult, SelectExpected } from "../types/index";

type SelectParam = string|string[]|{[key:string]: { as:string }};

export type SelectFunction = <E extends SelectExpected>(params: {
    db: Database;
    table: string;
    select: SelectParam,
    where?:Where;
    connector?:Connector;
    expected?:E;
    logQuery?:boolean;
    join?:Object;
}) => Promise<ExpectedResult<E>>;