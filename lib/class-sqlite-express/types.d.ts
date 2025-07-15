import { Database } from "sqlite3";
import { DBType } from "./db";
import { OptionsType } from "../options/types";
import {
    Where,
    ColumnType,
    Connector,
    SelectExpected,
    ExecuteSQLType,
    SelectParam,
    ColumnsParam,
    UpdateParam,
    InsertParam,
} from "../types";


// ─────────────────────────────────────────────────────────────
// CREATE DB
// ─────────────────────────────────────────────────────────────

export type CreateDbParams = {
    route?: string;
    key?: string;
    logQuery?: boolean;
};
export type CreateDbReturn = string;
export type CreateDbMethod = (params?: CreateDbParams) => CreateDbReturn;

// ─────────────────────────────────────────────────────────────
// GET DB
// ─────────────────────────────────────────────────────────────

export type GetDbParams = string;
export type GetDbReturn = DBType;
export type GetDbMethod = (dbKey?: GetDbParams) => GetDbReturn;

// ─────────────────────────────────────────────────────────────
// CREATE TABLE
// ─────────────────────────────────────────────────────────────

export type CreateTableParams = {
    db?: string;
    table?: string;
    columns?: ColumnsParam;
    logQuery?: boolean;
};
export type CreateTableReturn = Promise<void>;
export type CreateTableMethod = (params?: CreateTableParams) => CreateTableReturn;

// ─────────────────────────────────────────────────────────────
// INSERT
// ─────────────────────────────────────────────────────────────

export type InsertParams = {
    db?: string;
    table?: string;
    row?: InsertParam;
    logQuery?: boolean;
};
export type InsertReturn = Promise<number>;
export type InsertMethod = (params?: InsertParams) => InsertReturn;

// ─────────────────────────────────────────────────────────────
// SELECT
// ─────────────────────────────────────────────────────────────

export type SelectParams = {
    db?: string;
    table?: string;
    select?: SelectParam;
    where?: Where;
    connector?: Connector;
    logQuery?: boolean;
    expected?: SelectExpected;
};
export type SelectReturn<E extends SelectExpected = SelectExpected> = Promise<ExpectedResult<E>>;
export type SelectMethod<E extends SelectExpected = SelectExpected> = (params?: SelectParams) => SelectReturn<E>;

// ─────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────

export type UpdateParams = {
    db?: string;
    table?: string;
    update?: UpdateParam;
    where?: Where;
    connector?: Connector;
    logQuery?: boolean;
};
export type UpdateReturn = Promise<number>;
export type UpdateMethod = (params?: UpdateParams) => UpdateReturn;

// ─────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────

export type DeleteParams = {
    db?: string;
    table?: string;
    where?: Where;
    connector?: Connector;
    logQuery?: boolean;
};
export type DeleteReturn = Promise<number>;
export type DeleteMethod = (params?: DeleteParams) => DeleteReturn;

// ─────────────────────────────────────────────────────────────
// EXIST
// ─────────────────────────────────────────────────────────────

export type ExistParams = {
    db?: string;
    table?: string;
    where?: Where;
    connector?: Connector;
    logQuery?: boolean;
};
export type ExistReturn = Promise<boolean>;
export type ExistMethod = (params?: ExistParams) => ExistReturn;

// ─────────────────────────────────────────────────────────────
// COUNT
// ─────────────────────────────────────────────────────────────

export type CountParams = {
    db?: string;
    table?: string;
    where?: Where;
    connector?: Connector;
    logQuery?: boolean;
};
export type CountReturn = Promise<number>;
export type CountMethod = (params?: CountParams) => CountReturn;

// ─────────────────────────────────────────────────────────────
// EXECUTE SQL
// ─────────────────────────────────────────────────────────────

export type ExecuteSQLParams = {
    db?: string;
    query?: string;
    logQuery?: boolean;
    expected?: SelectExpected;
    type?: ExecuteSQLType;
};
export type ExecuteSQLReturn<E extends SelectExpected = SelectExpected> = Promise<ExpectedResult<E>>;
export type ExecuteSQLMethod<E extends SelectExpected = SelectExpected> = (params?: ExecuteSQLParams) => ExecuteSQLReturn<E>;

// ─────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────

export interface SqliteExpressType {
    _dataBasesList: { [key: string]: DBType };
    _rootPath: string;
    defaultOptions: OptionsType;

    set rootPath(value: string): void;
    get rootPath(): string;

    createDB(params?: CreateDbParams): CreateDbReturn;
    getDb(dbKey?: GetDbParams): GetDbReturn;
    createTable(params?: CreateTableParams): CreateTableReturn;
    insert(params?: InsertParams): InsertReturn;
    select(params?: SelectParams): SelectReturn;
    update(params?: UpdateParams): UpdateReturn;
    delete(params?: DeleteParams): DeleteReturn;
    exist(params?: ExistParams): ExistReturn;
    count(params?: CountParams): CountReturn;
    executeSQL(params?: ExecuteSQLParams): ExecuteSQLReturn;
}

export interface SqliteExpressClass {
    new (rootPath?: string): SqliteExpressType;
}

export type SqliteExpressConstructorMethod = (rootPath?: string) => SqliteExpressType;