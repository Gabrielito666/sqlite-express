import { ConnectorArg, LogQueryArg, TableArg, WhereArg } from "lib/types";
import { Database } from "sqlite3";

export type DeleteFunction = (sqliteDb: Database, args: TableArg & WhereArg & ConnectorArg & LogQueryArg) => Promise<number>;
