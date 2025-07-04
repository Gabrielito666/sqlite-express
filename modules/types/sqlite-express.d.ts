import { Database } from "sqlite3";
import { DBType } from "../classes/DB";
import { DefaultOptionsType } from "../classes/DefaultOptions";

type ColumnType = 'text'|'integer'|'datetime'|"TEXT"|"INTEGER"|"DATETIME";

// ─────────────────────────────────────────────────────────────
// CREATE DB
// ─────────────────────────────────────────────────────────────

export type CreateDbParams = { route?: string; key?: string; logQuery?: boolean };
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

export type CreateTableParams = { db?: string; table?: string; columns?: { [key: string]: ColumnType }; logQuery?: boolean };
export type CreateTableReturn = Promise<void>;
export type CreateTableMethod = (params?: CreateTableParams) => CreateTableReturn;

// ─────────────────────────────────────────────────────────────
// INSERT
// ─────────────────────────────────────────────────────────────

export type InsertParams = { db?: string; table?: string; row?: Object; logQuery?: boolean };
export type InsertReturn = Promise<boolean>;
export type InsertMethod = (params?: InsertParams) => InsertReturn;

// ─────────────────────────────────────────────────────────────
// SELECT
// ─────────────────────────────────────────────────────────────

export type SelectParams = {
    db?: string;
    table?: string;
    select?: string | string[];
    where?: Object | Object[];
    connector?: "AND" | "OR";
    join?: Object;
    processColumns?: boolean;
    processRows?: boolean;
    emptyResult?: any;
    logQuery?: boolean;
};
export type SelectReturn = Promise<Object | Object[] | string | boolean | number>;
export type SelectMethod = (params?: SelectParams) => SelectReturn;

// ─────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────

export type UpdateParams = { db?: string; table?: string; update?: Object; where?: Object | Object[]; connector?: "AND" | "OR"; logQuery?: boolean };
export type UpdateReturn = Promise<number>;
export type UpdateMethod = (params?: UpdateParams) => UpdateReturn;

// ─────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────

export type DeleteParams = { db?: string; table?: string; where?: Object | Object[]; connector?: "AND" | "OR"; logQuery?: boolean };
export type DeleteReturn = Promise<number>;
export type DeleteMethod = (params?: DeleteParams) => DeleteReturn;

// ─────────────────────────────────────────────────────────────
// EXIST
// ─────────────────────────────────────────────────────────────

export type ExistParams = { db?: string; table?: string; where?: Object | Object[]; connector?: "AND" | "OR"; logQuery?: boolean };
export type ExistReturn = Promise<boolean>;
export type ExistMethod = (params?: ExistParams) => ExistReturn;

// ─────────────────────────────────────────────────────────────
// COUNT
// ─────────────────────────────────────────────────────────────

export type CountParams = { db?: string; table?: string; where?: Object | Object[]; connector?: "AND" | "OR"; logQuery?: boolean };
export type CountReturn = Promise<number>;
export type CountMethod = (params?: CountParams) => CountReturn;

// ─────────────────────────────────────────────────────────────
// EXECUTE SQL
// ─────────────────────────────────────────────────────────────

export type ExecuteSQLParams = { db?: string; query?: string; processColumns?: boolean; processRows?: boolean; logQuery?: boolean; emptyResult?: any };
export type ExecuteSQLReturn = Promise<Object | Object[] | number | boolean | string>;
export type ExecuteSQLMethod = (params?: ExecuteSQLParams) => ExecuteSQLReturn;

// ─────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────

export interface SqliteExpressPrototype {
    set rootPath(value: string): void;

    get rootPath(): string;
    get defaultOptions(): DefaultOptionsType;

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

export interface SqliteExpressType extends SqliteExpressPrototype {
    _dataBasesList: { [key: string]: DBType };
    _rootPath: string;
    _defaultOptions: DefaultOptionsType;
}

export interface SqliteExpressConstructor {
    new (rootPath?: string): SqliteExpressType;
    prototype: SqliteExpressPrototype;
}

export type SqliteExpressConstructorFunction = (rootPath?: string) => SqliteExpressType;