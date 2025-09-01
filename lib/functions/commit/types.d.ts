import { LogQueryArg } from "../../types";
import { Statement } from "sqlite3";

export type CommitFunction = (sqliteCommitStmt: Statement, args?: LogQueryArg) => Promise<boolean>;