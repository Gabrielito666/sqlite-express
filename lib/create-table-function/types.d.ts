import { Database } from "sqlite3";
import { ColumnType } from "../types/sqlite-express";

export type CreateTableFunction = (params: {
    db: Database;
    table: string;
    columns: Object<string, ColumnType>;
    logQuery: boolean;
}) => Promise<void>;