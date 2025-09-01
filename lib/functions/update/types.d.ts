import { UpdateArg, LogQueryArg, TableArg, WhereArg } from "../../types";
import { Database } from "sqlite3";

export type UpdateFunction = (sqliteDb: Database, args: TableArg & UpdateArg & WhereArg & LogQueryArg) => Promise<number>;
