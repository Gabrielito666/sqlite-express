import { Database } from "sqlite3";
import { WaitingListType } from "../class-waiting-list/types";
import { OptionsType, CreateTableParams, SelectParams, InsertParams, UpdateParams, DeleteParams, ExistParams, CountParams, ExecuteSQLParams, ExpectedParam, TypeParam } from "../class-options/types";
import { CreateTableFunction } from "../function-create-table/types";
import { SelectFunction } from "../function-select/types";
import { InsertFunction } from "../function-insert/types";
import { UpdateFunction } from "../function-update/types";
import { DeleteFunction } from "../function-delete/types";
import { ExistFunction } from "../function-exist/types";
import { CountFunction } from "../function-count/types";
import { ExecuteSQLFunction } from "../function-execute-sql/types";
import { ExpectedResult } from "../class-options/types";

export interface DBType
{
    sqliteDb:Database;
    waitingList:WaitingListType;
    defaultOptions:OptionsType<ExpectedParam, TypeParam>;

    createTable(...params:Parameters<DBCreateTableMethod>):ReturnType<DBCreateTableMethod>;
    select<E extends ExpectedParam>(...params:Parameters<DBSelectMethod<E>>):ReturnType<DBSelectMethod<E>>;
    insert(...params:Parameters<DBInsertMethod>):ReturnType<DBInsertMethod>;
    update(...params:Parameters<DBUpdateMethod>):ReturnType<DBUpdateMethod>;
    delete(...params:Parameters<DBDeleteMethod>):ReturnType<DBDeleteMethod>;
    exist(...params:Parameters<DBExistMethod>):ReturnType<DBExistMethod>;
    count(...params:Parameters<DBCountMethod>):ReturnType<DBCountMethod>;
    executeSQL<E extends ExpectedParam, T extends TypeParam>(...params:Parameters<DBExecuteSQLMethod<E, T>>):ReturnType<DBExecuteSQLMethod<E, T>>;
}

export interface DBClass
{
    new(context:SqliteExpressType, options:OptionsType<ExpectedParam, TypeParam>):DBType;
};

export interface DBConstructorMethod
{
    (context:SqliteExpressType, options:OptionsType<ExpectedParam, TypeParam>):DBType;
}

export interface DBCreateTableMethod
{
    (params:Partial<CreateTableParams>):Promise<void>;
}
export interface DBSelectMethod<E extends ExpectedParam>
{
    (params:Partial<SelectParams<E>>): Promise<ExpectedResult<E>>;
}
export interface DBInsertMethod
{
    (params:Partial<InsertParams>):Promise<number>;
}
export interface DBUpdateMethod
{
    (params:Partial<UpdateParams>):Promise<number>;
}
export interface DBDeleteMethod
{
    (params:Partial<DeleteParams>):Promise<number>;
}
export interface DBExistMethod
{
    (params:Partial<ExistParams>):Promise<boolean>;
}
export interface DBCountMethod
{
    (params:Partial<CountParams>):Promise<number>;
}
export interface DBExecuteSQLMethod<E extends ExpectedParam, T extends TypeParam>
{
    (params:Partial<ExecuteSQLParams<E, T>>):Promise<
    T extends "select" ? ExpectedResult<E> : 
    T extends "insert" ? number :
    T extends "update" ? number :
    T extends "delete" ? number :
    T extends "create" ? void :
    T extends "any" ? ExpectedResult<E>|number :
    never
>;
}