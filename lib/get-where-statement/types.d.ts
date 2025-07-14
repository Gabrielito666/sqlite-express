export type ColumnName = Exclude<string, Connector>;
export type ColumnValue = string | number | string[] | number[] | null;
export type Connector = "AND" | "OR";
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

export type Where = | Condition | ConditionsList;

export type WhereQueryFunction = (where?: Where, connector?: Connector) => string;
export type PlaceHoldersFunction = (whereClause: Where) => Array<ColumnValue>;

// Types for the new function structure
export type PositionRef = { current: number };
export type ValuesObject = { [key: string]: ColumnValue };

export type ProcessWhereFunction = (
	where: Where, 
	connector?: Connector, 
	positionRef: PositionRef, 
	values: ValuesObject,
	isTopLevel?: boolean
) => string;

export type QueryResult = {
	query: string;
	values: ValuesObject;
};

export type GetWhereStatementFunction = (where?: Where, connector?: Connector) => QueryResult;