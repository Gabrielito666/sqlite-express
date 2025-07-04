import { Database } from "sqlite3";
import { ColumnType } from "./sqlite-express";
import { RecordWithTtl } from "dns";

export type CreateTableFunction = (params: {
    db: Database;
    table: string;
    columns: Object<string, ColumnType>;
    logQuery: boolean;
}) => Promise<void>;

export type InsertFunction = (params: {
    db: Database;
    table: string;
    row: Object;
    logQuery:boolean;
}) => Promise<boolean>;

type Celd = string|number|boolean|Object;
type Row = {[string]: Celd};
type CeldList = Celd[];
type RowList = Row[];

export type SelectFunction = <ProcessRows extends boolean, ProcessColumns extends boolean, EmptyResult extends any>(params: {
    db: Database;
    table: string;
    select: string|string[],
    where?:Object;
    connector?:"AND"|"OR";
    processColumns:ProcessColumns;
    processRows:ProcessRows;
    emptyResult:EmptyResult;
    logQuery:boolean;
    join?:Object;
}) =>Promise<
ProcessRows extends false
? 
    ProcessColumns extends false
    ?
    RowList
    :
    RowList|CeldList
:
    ProcessColumns extends false
    ?
    Row|RowList|EmptyResult
    :
    Row|RecordWithTtl|Celd|CeldList|EmptyResult
>;

type updateFunctionParam = <T>(value:T) => T;
export type UpdateFunction = (params: {
    db: Database;
    table: string;
    update: {[string]: (string|Object|boolean|number|updateFunctionParam)};
    where: Object;
    connector: "AND"|"OR";
    logQuery:boolean;
}) => Promise<number>;

export type DeleteFunction = (param: { db:Database; table:string; where:Object; connector: "AND"|"OR"; logQuery:boolean; }) => Promise<number>;

export type ExistFunction = (params: { db:Database; table:string; where:Object; connector:"AND"|"OR"; logQuery:boolean; }) => Promise<boolean>;
export type CountFunction = (params: { db:Database; table:string; where:Object; connector:"AND"|"OR"; logQuery:boolean; }) => Promise<number>;

export type ExecuteSQLFunction = (params:{
    db:Database;
    query:string;
    logQuery:boolean;
    emptyResult:any;
    processColumns:boolean;
    processRows:boolean;
}) => Promise<any>;