import {Parameters, Query} from "lib/types/params";
import {RowValue} from "lib/types/returns";
import {Database, RunResult, Statement} from "sqlite3";

export interface WrapCall
{
    run: {
        (sqliteDb: Database, query: Query, parameters: Parameters): Promise<RunResult>;
    };
    get: {
        (sqliteDb: Database, query: Query, parameters: Parameters): Promise<RowValue>;
    };
    all: {
        (sqliteDb: Database, query: Query, parameters: Parameters): Promise<RowValue[]>;
    };
    prepare: {
        (sqliteDb: Database, query: Query): Promise<Statement>;
    };
    statement:
    {
        run: {
            (statement: Statement, parameters: Parameters): Promise<RunResult>;
        };
        get: {
            (statement: Statement, parameters: Parameters): Promise<RowValue>;
        };
        all: {
            (statement: Statement, parameters: Parameters): Promise<RowValue[]>;
        };
    };
}