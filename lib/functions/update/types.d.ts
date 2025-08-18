import Table from "lib/class/table";
import { UpdateArg, ConnectorArg, LogQueryArg, TableArg, WhereArg } from "lib/types";
import { Database } from "sqlite3";

export type UpdateFunction = (sqliteDb: Database, args: TableArg & UpdateArg & WhereArg & ConnectorArg & LogQueryArg) => Promise<number>;