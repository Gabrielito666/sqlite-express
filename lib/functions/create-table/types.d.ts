import { ColumnsArg, LogQueryArg, TableNameArg } from "../../types/index";
import { Database } from "sqlite3";
import { Table } from "../../class/table/types";

export type CreateTableFunction = (sqliteDb: Database, args: (TableNameArg & ColumnsArg & LogQueryArg)) => Promise<Table>;