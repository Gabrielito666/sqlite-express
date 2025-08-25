import { CeldValue, Where } from "../../types";


// Types for the new function structure
export type PositionRef = { current: number };
export type ValuesObject = { [key: string]: CeldValue };

export type ProcessWhereFunction = (
	where: Where, 
	positionRef: PositionRef, 
	values: ValuesObject,
) => string;

export type QueryResult = {
	query: string;
	values: ValuesObject;
};

export type GetWhereStatementFunction = (where?: Where) => QueryResult;