import { ConnectorArg, LogQueryArg, TableArg, WhereArg } from "lib/types";
import { Database } from "sqlite3";

export type ExistFunction = (sqliteDb: Database, args: TableArg & WhereArg & ConnectorArg & LogQueryArg) => Promise<boolean>;