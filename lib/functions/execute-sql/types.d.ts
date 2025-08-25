import { CeldValue, ColumnValue, RowValue, RowsValue, LogQueryArg, ParametersArg, QueryArg, Parameters } from "../../types";
import { Database, RunResult } from "sqlite3";

export interface ExecuteSQLSentence
{
    (args: QueryArg & ParametersArg & LogQueryArg): {
        finalQuery: Query;
        normalizedParams: Parameters;
    };
}

export interface ExecuteSQLFunction
{
    (
        sqliteDb: Database,
        args: QueryArg & ParametersArg & LogQueryArg
    ): Promise<RunResult>;
    select:
    {
        (
            sqliteDb: Database,
            args: QueryArg & ParametersArg & LogQueryArg
        ): Promise<RowsValue>;
        rows(
            sqliteDb: Database,
            args: QueryArg & ParametersArg & LogQueryArg
        ): Promise<RowsValue>;
        row(
            sqliteDb: Database,
            args: QueryArg & ParametersArg & LogQueryArg
        ): Promise<RowValue>;
        celd(
            sqliteDb: Database,
            args: QueryArg & ParametersArg & LogQueryArg
        ): Promise<CeldValue>;
        column(
            sqliteDb: Database,
            args: QueryArg & ParametersArg & LogQueryArg
        ): Promise<ColumnValue>;
    };
    insert:
    {
        (
            sqliteDb: Database,
            args: QueryArg & ParametersArg & LogQueryArg
        ): Promise<number>;
    };
    update:
    {
        (
            sqliteDb: Database,
            args: QueryArg & ParametersArg & LogQueryArg
        ): Promise<number>;
    };
    delete:
    {
        (
            sqliteDb: Database,
            args: QueryArg & ParametersArg & LogQueryArg
        ): Promise<number>;
    };
    justRun:
    {
        (
            sqliteDb: Database,
            args: QueryArg & ParametersArg & LogQueryArg
        ): Promise<RunResult>;
    };
}