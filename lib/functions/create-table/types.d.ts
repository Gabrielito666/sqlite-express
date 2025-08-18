import { ColumnsArg, LogQueryArg, TableArg, TableNameArg } from "lib/types";
import { Database } from "sqlite3";
import Table from "lib/class/table";

export type CreateTableFunction = (sqliteDb: Database, args: TableNameArg & ColumnsArg & LogQueryArg) => Promise<Table>;