import { LogQueryArg } from "lib/types";
import { Statement } from "sqlite3";

export interface BeginFunction 
{
    (sqliteBeginTransactionStmt: Statement, args?: LogQueryArg):Promise<boolean>;
    transaction(sqliteBeginTransactionStmt: Statement, args?: LogQueryArg):Promise<boolean>;
    deferredTransaction(sqliteBeginTransactionStmt: Statement, args?: LogQueryArg):Promise<boolean>;
    immediateTransaction(sqliteBeginTransactionStmt: Statement, args?: LogQueryArg):Promise<boolean>;
    exclusiveTransaction(sqliteBeginTransactionStmt: Statement, args?: LogQueryArg):Promise<boolean>;
}