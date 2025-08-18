import { Connector, LogQuery, Where, Table } from "lib/types";
import { Database } from "sqlite3";

export type CountFunction = (sqliteDb: Database, args: Table & Where & Connector & LogQuery) => Promise<number>;