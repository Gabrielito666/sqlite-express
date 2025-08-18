import { LogQueryArg } from "lib/types";
import { Statement } from "sqlite3";

export type CommitFunction = (sqliteCommitStmt: Statement, args: LogQueryArg) => Promise<boolean>;