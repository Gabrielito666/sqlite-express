import { Database } from "sqlite3";
import { ExpectedResult, SelectExpected } from "../types/index";

type ExecuteSQLType = "select"|"insert"|"update"|"delete"|"any"|"create";

export type ExecuteSQLFunction = <E extends SelectExpected, T extends ExecuteSQLType>(params:{
    db:Database;
    query:string;
    logQuery:boolean;
    expected?:E;
    parameters?:{ [key:string]:string|number|boolean|object|null};
    type?: T;
}) => Promise<
    T extends "select" ? ExpectedResult<E> :
    T extends "insert" ? number :
    T extends "update" ? number :
    T extends "delete" ? number :
    T extends "create" ? void :
    T extends "any" ? ExpectedResult<E>|number :
    never
>;