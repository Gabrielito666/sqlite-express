import { TableArg, SelectArg, WhereArg, LogQueryArg, Parameters, RowValue, RowsValue, CeldValue, ColumnValue } from "../../types";
import { Database } from "sqlite3";

export type SelectParam = string|string[]|{[key:string]: { as:string }};

export interface SelectSentenceFunction
{
    (args: TableArg & SelectArg & WhereArg & LogQueryArg): { finalQuery: string, parameters: Parameters };
}

export interface SelectFunction
{
    (sqliteDb: Database, args: TableArg & SelectArg & WhereArg & LogQueryArg): Promise<RowsValue>;
    rows(sqliteDb: Database, args: TableArg & SelectArg & WhereArg & LogQueryArg): Promise<RowsValue>;
    row(sqliteDb: Database, args: TableArg & SelectArg & WhereArg & LogQueryArg): Promise<RowValue>;
    celd(sqliteDb: Database, args: TableArg & SelectArg & WhereArg & LogQueryArg): Promise<CeldValue>;
    column(sqliteDb: Database, args: TableArg & SelectArg & WhereArg & LogQueryArg): Promise<ColumnValue>;
}
