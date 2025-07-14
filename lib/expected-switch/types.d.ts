import { Database } from "sqlite3";

type SelectExpected = "celd"|"row"|"column"|"rows";

type CeldValue = string|number|boolean|null;
type RowValue = {[key: string]: CeldValue};
type ColumnValue = CeldValue[];
type RowsValue = RowValue[];

export type ExpectedSwitchFunction = <E extends SelectExpected>(params: {
    db: Database;
    query: string;
    parameters: { [key:string]:string|number|boolean|object|null};
    expected:E;
    logQuery:boolean;
}) => Promise <
    E extends "celd" ? CeldValue :
    E extends "row" ? RowValue|null :
    E extends "column" ?
    ColumnValue
    : RowsValue
>;