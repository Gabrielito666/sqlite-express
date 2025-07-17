import { TableType } from "lib/class-table";
import { DBType } from "../class-db/types";

export type ColumnName = Exclude<string, Connector>;
export type ColumnValue = string | number | string[] | number[] | null |"NULL";
export type ConnectorParam = "AND" | "OR";
export type ComparisonOperator = "=" | "!=" | ">" | "<" | ">=" | "<=" | "LIKE" | "NOT LIKE" | "IS" | "IS NOT";
type ListOperator = "IN" | "NOT IN";

export interface ConditionDefaultOperator
{
	AND?: never;
	OR?: never;
	[key: ColumnName]: ColumnValue;
}

export type ConditionComplete =
{
	AND?: never;
	OR?: never;
	[key: ColumnName]: {
		value: ColumnValue;
		operator: ComparisonOperator;
	}
}|{
	AND?: never;
	OR?: never;
	[key: ColumnName]: {
		value: ColumnValue[];
		operator: ListOperator;
	}
};

export type Condition = ConditionDefaultOperator | ConditionComplete | Record<string, ColumnValue | { value: ColumnValue; operator: ComparisonOperator }>;

export type ConditionsList = 
	| { AND: (Condition | ConditionsList)[]; OR?: never }
	| { OR: (Condition | ConditionsList)[]; AND?: never };

export type WhereParam = | Condition | ConditionsList | undefined;

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

type RowParam =
| string          // TEXT, DATE, DATETIME (formateado)
| number          // INTEGER, REAL, NUMERIC
| boolean         // BOOLEAN (se convierte a 0 o 1)
| null            // NULL
| Buffer          // BLOB
| object;         // JSON

export interface Params
{
  rootPath: string;
  route: string;
  db: DBType;
  table: string|TableType;
  where: WhereParam;
  columns: { [key: string]: SQLType };
  select: string|string[]|{[key:string]: { as:string }};
  connector: ConnectorParam;
  update: {[key: string]: (string|number|boolean|(<T>(value:T) => T)|object)};
  row: {[key:string]:RowParam};
  logQuery: boolean;
  query: string;
  expected: "celd"|"row"|"column"|"rows";
  parameters: {[key: string]: RowParam};
  type: "select"|"insert"|"update"|"delete"|"any"|"create";
}