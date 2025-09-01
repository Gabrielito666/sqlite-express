import Table from "lib/class/table";
import { UpdateArg, LogQueryArg, TableArg, WhereArg } from "lib/types";
import { Database } from "sqlite3";

export type UpdateFunction = (sqliteDb: Database, args: TableArg & UpdateArg & WhereArg & LogQueryArg) => Promise<number>;
