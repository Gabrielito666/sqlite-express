export { DB } from "../class/db/types";
export { Scope } from "../class/scopes-queue/types";
export { Table } from "../class/table/types";
export { SqliteExpress } from "../class/sqlite-express/types";

export { BeginFunction } from "../functions/begin"
export { CommitFunction } from "../functions/commit";
export { CountFunction } from "../functions/count";
export { CreateTableFunction } from "../functions/create-table";
export { DeclareSQLFunction } from "../functions/declare-sql";
export { DeleteFunction } from "../functions/delete";
export { ExecuteSQLFunction } from "../functions/execute-sql";
export { ExistFunction } from "../functions/exist";
export { InsertFunction } from "../functions/insert";
export { RollbackFunction } from "../functions/rollback";
export { SelectFunction } from "../functions/select";
export { UpdateFunction } from "../functions/update";

import { Table } from "../class/table/types";
import { DB } from "../class/db/types";
import { Scope } from "../class/scopes-queue/types";
import { SqliteExpress } from "../class/sqlite-express/types";

// SELECT RETURNS

export type CeldValue = string|number|boolean|null|Buffer;
export type RowValue = {[key: string]: CeldValue}|null;
export type ColumnValue = CeldValue[];
export type RowsValue = RowValue[];

type ComparisonOperator = "=" | "!=" | ">" | "<" | ">=" | "<=" | "LIKE" | "NOT LIKE" | "IS" | "IS NOT";
type ListOperator = "IN" | "NOT IN";

type SentenceEqualOperatorCell =
{
  [K in string]: CeldValue;
  AND?: never;
  OR?: never;
}

type SentenceComparisonOperatorCell = [string, ComparisonOperator, CeldValue];

type SentenceListOperatorCell = [string, ListOperator, CeldValue[]];

type SentenceCell =
  | SentenceEqualOperatorCell
  | SentenceComparisonOperatorCell
  | SentenceListOperatorCell;

type LogicalAND = {
  AND: Where[];
  OR?: never;
};
type LogicalOR  = {
  OR: Where[];
  AND?: never;
};

type LogicalConditionsUnion = LogicalAND | LogicalOR;

// --- Where (recursivo) ---
export type Where = SentenceCell | LogicalConditionsUnion;

type SQLType =
  | "INTEGER"
  | "INTEGER PRIMARY KEY"
  | "INTEGER PRIMARY KEY AUTOINCREMENT"
  | "INTEGER NOT NULL"
  | "INTEGER NOT NULL UNIQUE"
  | "INTEGER UNIQUE"
  | "INTEGER DEFAULT 0"
  | "INTEGER NOT NULL DEFAULT 0"
  | "INTEGER DEFAULT 1"
  | "INTEGER NOT NULL DEFAULT 1"
  | "TEXT"
  | "TEXT NOT NULL"
  | "TEXT UNIQUE"
  | "TEXT NOT NULL UNIQUE"
  | "TEXT DEFAULT ''"
  | "TEXT NOT NULL DEFAULT ''"
  | "TEXT COLLATE NOCASE"
  | "TEXT DEFAULT 'N/A'"
  | "TEXT NOT NULL DEFAULT 'N/A'"
  | "REAL"
  | "REAL DEFAULT 0.0"
  | "REAL NOT NULL"
  | "REAL NOT NULL DEFAULT 0.0"
  | "BOOLEAN"
  | "BOOLEAN DEFAULT 0"
  | "BOOLEAN DEFAULT 1"
  | "BOOLEAN NOT NULL DEFAULT 0"
  | "BOOLEAN NOT NULL DEFAULT 1"
  | "NUMERIC"
  | "NUMERIC DEFAULT 0"
  | "NUMERIC NOT NULL DEFAULT 0"
  | "DATE"
  | "DATE DEFAULT CURRENT_DATE"
  | "DATE NOT NULL DEFAULT CURRENT_DATE"
  | "DATETIME"
  | "DATETIME DEFAULT CURRENT_TIMESTAMP"
  | "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP"
  | "BLOB"
  | "BLOB NOT NULL"
  | "BLOB DEFAULT X''"
  | "INTEGER REFERENCES otra_tabla"
  | "TEXT REFERENCES otra_tabla"
  | "INTEGER NOT NULL REFERENCES otra_tabla"
  | "TEXT NOT NULL REFERENCES otra_tabla";

export type Parameters = {[key: string]: CeldValue}|CeldValue[];
export type Route = string;
export type TableName = string;
export type Where = WhereParam;
export type Columns = { [key: string]: SQLType };
export type Select = string|string[]|{[key:string]: { as:string }};
export type Update = {[key: string]: (any|((value:any) => any))};
export type Row = RowValue|RowValue[];
export type LogQuery = boolean;
export type Query = string;
export type Parameters = {[key: string]: CeldValue}|CeldValue[];

export type DBArg = {db: DB};
export type RouteArg = {route: Route};
export type TableNameArg = {tableName: TableName};
export type TableArg = {table: Table};
export type WhereArg = {where?: Where};
export type ColumnsArg = {columns: Columns};
export type SelectArg = {select?: Select};
export type UpdateArg = {update: Update};
export type RowArg = {row: Row};
export type LogQueryArg = {logQuery?: LogQuery};
export type QueryArg = {query: Query};
export type ParametersArg = {parameters?: Parameters};
export type ScopeArg = {scope?: Scope};