import { OptionsType, ExpectedResult, ExpectedParam, TypeParam, SelectParams, InsertParams, UpdateParams, DeleteParams, ExistParams, CountParams, ExecuteSQLParams, CreateDbParams } from "../class-options/types";
import { CreateTableParams, CreateDbParams, DBType, DBSelectMethod, DBInsertMethod, DBUpdateMethod, DBDeleteMethod, DBExistMethod, DBCountMethod, DBExecuteSQLMethod, ExpectedResult, ExpectedParam, TypeParam } from "../class-db/types";



export interface SqliteExpressType {
    _rootPath: string;
    defaultOptions: OptionsType<ExpectedParam, TypeParam>;

    set rootPath(value: string): void;
    get rootPath(): string;

    createDB(options?: Partial<CreateDbParams>): DBType;
    createTable(...params:Parameters<SqliteExpressCreateTableMethod>):ReturnType<SqliteExpressCreateTableMethod>;
    select<E extends ExpectedParam>(...params:Parameters<SqliteExpressSelectMethod<E>>):ReturnType<SqliteExpressSelectMethod<E>>;
    insert(...params:Parameters<SqliteExpressInsertMethod>):ReturnType<SqliteExpressInsertMethod>;
    update(...params:Parameters<SqliteExpressUpdateMethod>):ReturnType<SqliteExpressUpdateMethod>;
    delete(...params:Parameters<SqliteExpressDeleteMethod>):ReturnType<SqliteExpressDeleteMethod>;
    exist(...params:Parameters<SqliteExpressExistMethod>):ReturnType<SqliteExpressExistMethod>;
    count(...params:Parameters<SqliteExpressCountMethod>):ReturnType<SqliteExpressCountMethod>;
    executeSQL<E extends ExpectedParam, T extends TypeParam>(...params:Parameters<SqliteExpressExecuteSQLMethod<E, T>>):ReturnType<SqliteExpressExecuteSQLMethod<E, T>>;
}

export interface SqliteExpressClass {
    new (rootPath?: string): SqliteExpressType;
}

export interface SqliteExpressSelectMethod<E extends ExpectedParam> {
    (params:Partial<SelectParams<E>>): Promise<ExpectedResult<E>>;
}

export interface SqliteExpressCreateDbMethod {
    (options?: Partial<CreateDbParams>): DBType;
}

export interface SqliteExpressCreateTableMethod {
    (options?: Partial<CreateTableParams>): Promise<void>;
}

export interface SqliteExpressInsertMethod {
    (options?: Partial<InsertParams>): Promise<number>;
}

export interface SqliteExpressUpdateMethod {
    (options?: Partial<UpdateParams>): Promise<number>;
}

export interface SqliteExpressDeleteMethod {
    (options?: Partial<DeleteParams>): Promise<number>;
}

export interface SqliteExpressExistMethod {
    (options?: Partial<ExistParams>): Promise<boolean>;
}

export interface SqliteExpressCountMethod {
    (options?: Partial<CountParams>): Promise<number>;
}

export interface SqliteExpressExecuteSQLMethod<E extends ExpectedParam, T extends TypeParam>
{
    (options?: Partial<ExecuteSQLParams<E, T>>): Promise<
    T extends "select" ? ExpectedResult<E> : 
    T extends "insert" ? number :
    T extends "update" ? number :
    T extends "delete" ? number :
    T extends "create" ? void :
    T extends "any" ? ExpectedResult<E>|number :
    never
>;
}

export type SqliteExpressConstructorMethod = (rootPath?: string) => SqliteExpressType;