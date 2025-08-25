import { LogQueryArg, TableArg, WhereArg } from "../../types";
import { Database } from "sqlite3";

export type DeleteFunction = (sqliteDb: Database, args: TableArg & WhereArg & LogQueryArg) => Promise<number>;
