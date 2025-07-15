import { WhereParam, ConnectorParam } from "../class-options/types";


export type WhereQueryFunction = (where?: WhereParam, connector?: ConnectorParam) => string;
export type PlaceHoldersFunction = (whereClause: WhereParam) => Array<ColumnValue>;

// Types for the new function structure
export type PositionRef = { current: number };
export type ValuesObject = { [key: string]: ColumnValue };

export type ProcessWhereFunction = (
	where: WhereParam, 
	connector?: ConnectorParam, 
	positionRef: PositionRef, 
	values: ValuesObject,
	isTopLevel?: boolean
) => string;

export type QueryResult = {
	query: string;
	values: ValuesObject;
};

export type GetWhereStatementFunction = (where?: WhereParam, connector?: ConnectorParam) => QueryResult;