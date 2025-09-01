import { LogQueryArg, RowArg, TableArg } from "../../types";
import { Database } from "sqlite3";

export type InsertFunction = (sqliteDb: Database, args: TableArg & RowArg & LogQueryArg) => Promise<number>;