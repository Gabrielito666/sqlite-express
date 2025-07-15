import { Database } from "sqlite3";
import { DBType } from "../class-db/types";
import { OptionsType } from "../options/types";
import { CreateTableFunction } from "../function-create-table/types";
import { SelectFunction } from "../function-select/types";
import { InsertFunction } from "../function-insert/types";
import { UpdateFunction } from "../function-update/types";
import { DeleteFunction } from "../function-delete/types";
import { ExistFunction } from "../function-exist/types";
import { CountFunction } from "../function-count/types";

export type MethodType = CreateTableFunction|SelectFunction|InsertFunction|UpdateFunction|DeleteFunction|ExistFunction|CountFunction;

export interface WaitingListType
{
    database:DBType;
    list:function[];
    isRunning: boolean;
    addOperation<M extends MethodType>(...params:Parameters<WaitingListAddOperationMethod<M>>):ReturnType<WaitingListAddOperationMethod<M>>;
    run():void;
};


export interface WaitingListClass
{
    new(database:DBType):WaitingListType;
};

export interface WaitingListConstructorMethod
{
    (database:DBType):WaitingListType;
};

export interface WaitingListRunMethod
{
    ():Promise<void>;
};


export interface WaitingListAddOperationMethod<M extends MethodType>
{
    (method:M, parameters:OptionsType):ReturnType<M>;
};