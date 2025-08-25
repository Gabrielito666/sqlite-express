import { LogQueryArg, TableArg, WhereArg } from "../../types";
import { Database } from "sqlite3";

export type CountFunction = (sqliteDb: Database, args: (TableArg & WhereArg & LogQueryArg)) => Promise<number>;