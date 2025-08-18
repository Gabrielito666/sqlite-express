import { LogQueryArg } from "lib/types";
import { Statement } from "sqlite3";

export type BeginTransactionFunction = (sqliteBeginTransactionStmt: Statement, args: LogQueryArg) => Promise<boolean>;