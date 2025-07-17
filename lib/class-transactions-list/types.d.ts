import { DBType } from "lib/class-db/types";
import { TransactionType } from "lib/class-transaction/types";
import { SqliteExpressType } from "lib/class-sqlite-express/types";

export interface TransactionsListType
{
    list: TransactionType[];
    context: DBType|SqliteExpressType;
    isRunning: boolean;
    createTransaction(): TransactionType;
    run(): Promise<void>;
}

export interface TransactionsListClass
{
    new(context: DBType): TransactionsListType;
}