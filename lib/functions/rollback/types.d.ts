import { LogQueryArg } from "../../types";
import { Statement } from "sqlite3";

export type RollbackFunction = (stmtRollback: Statement, args?: LogQueryArg) => Promise<boolean>;