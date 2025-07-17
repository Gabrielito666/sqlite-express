import { DBType } from "lib/class-db";
import { Params } from "lib/class-options";
import { TableType } from "lib/class-table/types";

type CeldValue = string|number|boolean|null;
type RowValue = {[key: string]: CeldValue};
type ColumnValue = CeldValue[];
type RowsValue = RowValue[];

type SelectReturns<E extends Params["expected"]> = Promise<
    E extends "celd" ? CeldValue|null :
    E extends "row" ? RowValue|null :
    E extends "column" ? ColumnValue :
    RowsValue
>;
type ExecuteSQLReturns<
    E extends Params["expected"],
    T extends Params["type"]
> =
    T extends "select" ? Returns<E>["select"] :
    T extends "insert" ? Returns["insert"] :
    T extends "update" ? Returns["update"] :
    T extends "delete" ? Returns["delete"] :
    T extends "exist" ? Returns["exist"] :
    T extends "count" ? Returns["count"] :
    Promise<void>
;


export interface Returns<
    E extends Params["expected"] = Params["expected"],
    T extends Params["type"] = Params["type"]
>
{
    createTable: Promise<TableType>;
    createDB: Promise<DBType>;
    select: SelectReturns<E>;
    insert: Promise<number>;
    update: Promise<number>;
    delete: Promise<number>;
    exist: Promise<boolean>;
    count: Promise<number>;
    executeSQL: ExecuteSQLReturns<E, T>;
    beginTransaction: Promise<true>;
    rollback: Promise<true>;
    commit: Promise<true>;
    declareSQL: Promise<(params: Params["parameters"]) => ExecuteSQLReturns<E, T>>;
}