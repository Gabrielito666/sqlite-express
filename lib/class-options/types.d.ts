import { DBType } from "../class-db/types";
import { SqliteExpressType } from "lib/class-sqlite-express/types";

export type ColumnName = Exclude<string, Connector>;
export type ColumnValue = string | number | string[] | number[] | null;
export type ConnectorParam = "AND" | "OR";
export type ComparisonOperator = "=" | "!=" | ">" | "<" | ">=" | "<=" | "LIKE" | "NOT LIKE" | "IN" | "NOT IN" | "IS" | "IS NOT" | "IS NULL" | "IS NOT NULL";

export interface ConditionDefaultOperator
{
	AND?: never;
	OR?: never;
	[key: ColumnName]: ColumnValue;
}

export interface ConditionComplete
{
	AND?: never;
	OR?: never;
	[key: ColumnName]: {
		value: ColumnValue;
		operator: ComparisonOperator;
	}
}

export type Condition = ConditionDefaultOperator | ConditionComplete | Record<string, ColumnValue | { value: ColumnValue; operator: ComparisonOperator }>;

export type ConditionsList = 
	| { AND: (Condition | ConditionsList)[]; OR?: never }
	| { OR: (Condition | ConditionsList)[]; AND?: never };

export type WhereParam = | Condition | ConditionsList | undefined;

export type ColumnType = "text"|"integer"|"datetime"|"TEXT"|"INTEGER"|"DATETIME";
export type ColumnsParam = { [key: string]: ColumnType };

export type SelectParam = string|string[]|{[key:string]: { as:string }};

type UpdateFunctionParam = <T>(value:T) => T;
type UpdateParam = {[key: string]: (string|number|boolean|UpdateFunctionParam|object)};

export type RowParam = {[key:string]:string|number|boolean|Object|null};

type ExpectedParam = "celd"|"row"|"column"|"rows";
type CeldValue = string|number|boolean|null;
type RowValue = {[key: string]: CeldValue};
type ColumnValue = CeldValue[];
type RowsValue = RowValue[];

export type ExpectedResult<E extends ExpectedParam> = 
    E extends "celd" ? CeldValue :
    E extends "row" ? RowValue|null :
    E extends "column" ? ColumnValue :
    RowsValue;


export type ParametersParam = {[key: string]: number|string|boolean|Object|null};

type TypeParam = "select"|"insert"|"update"|"delete"|"any"|"create-table";

export interface SelectParams
{
    db: DBType;
    table: string;
    select: SelectParam;
    where: WhereParam;
    connector: ConnectorParam;
    logQuery: boolean;
    expected: ExpectedParam;
}

export interface InsertParams
{
    db: DBType;
    table: string;
    row: RowParam;
    logQuery: boolean;
}

export interface UpdateParams
{
    db: DBType;
    table: string;
    update: UpdateParam;
    where: WhereParam;
    connector: ConnectorParam;
    logQuery: boolean;
}

export interface DeleteParams
{
    db: DBType;
    table: string;
    where: WhereParam;
    connector: ConnectorParam;
    logQuery: boolean;
}

export interface ExistParams
{
    db: DBType;
    table: string;
    where: WhereParam;
    connector: ConnectorParam;
    logQuery: boolean;
}

export interface CountParams
{
    db: DBType;
    table: string;
    where: WhereParam;
    connector: ConnectorParam;
    logQuery: boolean;
}

export interface ExecuteSQLParams
{
    db: DBType;
    query: string;
    parameters: ParametersParam;
    logQuery: boolean;
    expected: ExpectedParam;
    type: TypeParam;
}

export interface CreateTableParams
{
    db: DBType;
    table: string;
    columns: ColumnsParam;
    logQuery: boolean;
}

export interface OptionsSetParams {
  route?: string;
  db?: DBType;
  key?: string;
  table?: string;
  where?: WhereParam;
  columns?: ColumnsParam;
  select?: SelectParam;
  connector?: ConnectorParam;
  update?: UpdateParam;
  row?: RowParam;
  logQuery?: boolean;
  query?: string;
  expected?: ExpectedParam;
  parameters?: ParametersParam;
  type?: TypeParam;
}

export interface OptionsConstructorMethod
{
    (context:SqliteExpressType, route:string):OptionsType;
}
export interface OptionsSetMethod
{
    (options:OptionsSetParams):void;
}


export interface OptionsType<E extends ExpectedParam, T extends TypeParam>
{
    _context: SqliteExpressType;
    rootPath: string;
    route?: string;
    db?: DBType;
    table?: string;
    where: WhereParam;
    columns?: ColumnsParam;
    select?: SelectParam;
    connector: ConnectorParam;
    update?: UpdateParam;
    row?: RowParam;
    logQuery: boolean;
    query?: string;
    expected: E;
    parameters: ParametersParam;
    type: T;

    set(options: OptionsSetParams): void;
    combination(...options: OptionsType<ExpectedParam, TypeParam>[]): OptionsType<ExpectedParam, TypeParam>;
};

export interface OptionsClass
{
    new(context:SqliteExpressType, route:string):OptionsType<ExpectedParam, TypeParam>;
}
export interface OptionsCombinationMethod
{
    (...options: OptionsType[]): OptionsType;
}