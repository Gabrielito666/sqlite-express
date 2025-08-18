import { LogQueryArg, QueryArg, Parameters, RowsValue, RowValue, ColumnValue, CeldValue } from "lib/types";
import { Database, RunResult } from "sqlite3";

export interface StatementSentence
{
    (parameters:Parameters): Parameters;
}

export interface StatementFunction
{
    (parameters:Parameters): Promise<RunResult>;
    select:
    {
        (parameters:Parameters): Promise<RowsValue>;
        rows(parameters:Parameters): Promise<RowsValue>;
        row(parameters:Parameters): Promise<RowValue>;
        celd(parameters:Parameters): Promise<CeldValue>;
        column(parameters:Parameters): Promise<ColumnValue>;
    };
    insert:
    {
        (parameters:Parameters): Promise<number>;
    };
    update:
    {
        (parameters:Parameters): Promise<number>;
    };
    delete:
    {
        (parameters:Parameters): Promise<number>;
    };
    justRun:
    {
        (parameters:Parameters): Promise<RunResult>;
    };
}

export interface DeclareSQLFunction
{
    (sqliteDb: Database, args: QueryArg & LogQueryArg): Promise<StatementFunction>;
}